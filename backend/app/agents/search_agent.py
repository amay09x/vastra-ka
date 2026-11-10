import re
import time

from app.services.search_service import SearchService
from app.services.ranking_service import RankingService

class SearchAgent:

    # =========================================================
    # LIMITS
    # =========================================================

    MAX_SINGLE_ITEM_RESULTS = 16
    MAX_COMPLETE_OUTFIT_RESULTS = 16
    MAX_COMPONENT_RESULTS = 8

    # =========================================================
    # INIT
    # =========================================================

    def __init__(self):

        self.search_service = SearchService()
        self.ranking = RankingService()

    # =========================================================
    # MONEY / BUDGET HELPERS
    # =========================================================

    @staticmethod
    def _extract_budget_number(budget):

        if budget is None:
            return None

        text = str(budget).lower().strip()

        text = text.replace(",", "")

        # Examples:
        # ₹600
        # rs 600
        # 600 rupees
        # 600
        # 2k

        match = re.search(
            r"₹?\s*(\d+(?:\.\d+)?)\s*k\b",
            text
        )

        if match:

            try:
                return int(
                    float(match.group(1)) * 1000
                )

            except ValueError:
                return None

        match = re.search(
            r"₹?\s*(\d+(?:\.\d+)?)",
            text
        )

        if match:

            try:
                return int(
                    float(match.group(1))
                )

            except ValueError:
                return None

        return None

    @staticmethod
    def _format_budget(amount):

        if amount is None:
            return ""

        return f"₹{amount}"

    # =========================================================
    # CONVERSATION HELPERS
    # =========================================================

    @staticmethod
    def _user_messages_only(message):

        if not message:
            return ""

        text = str(message)

        user_parts = []

        for line in text.splitlines():

            stripped = line.strip()

            if stripped.lower().startswith("user:"):

                user_parts.append(
                    stripped[5:].strip()
                )

        if not user_parts:
            return text

        return "\n".join(
            user_parts
        )

    # =========================================================
    # COMPLETE OUTFIT DETECTION
    # =========================================================

    def _is_complete_outfit_request(
        self,
        message
    ):

        user_text = (
            self._user_messages_only(message)
            .lower()
        )

        complete_phrases = [

            "complete outfit",
            "full outfit",
            "whole outfit",
            "entire outfit",

            "complete look",
            "full look",
            "whole look",

            "ready made outfit",
            "ready-made outfit",

            "ready made look",
            "ready-made look",

            "outfit set",
            "full set",

            "everything together",
            "all together",

            "one complete outfit",
            "one full outfit",
        ]

        return any(
            phrase in user_text
            for phrase in complete_phrases
        )

    # =========================================================
    # NORMAL OUTFIT DETECTION
    # =========================================================

    def _is_outfit_request(
        self,
        message,
        intent
    ):

        user_text = (
            self._user_messages_only(message)
            .lower()
        )

        # ---------------------------------------------
        # Clear outfit language
        # ---------------------------------------------

        outfit_phrases = [

            "build an outfit",
            "build me an outfit",
            "create an outfit",
            "create me an outfit",

            "need an outfit",
            "want an outfit",
            "looking for an outfit",

            "build a look",
            "create a look",
            "create me a look",

            "style me",
            "style an outfit",
            "style my outfit",

            "what should i wear",
            "what can i wear",

        ]

        if any(
            phrase in user_text
            for phrase in outfit_phrases
        ):
            return True

        # ---------------------------------------------
        # Explicit "outfit" / "look"
        # ---------------------------------------------

        if "outfit" in user_text:
            return True

        if "look" in user_text:
            return True

        # ---------------------------------------------
        # Intent fallback
        # ---------------------------------------------

        category = str(
            intent.get(
                "category",
                ""
            )
        ).lower().strip()

        if category in {
            "outfit",
            "look",
            "full look",
            "complete outfit"
        }:

            return True

        return False

    # =========================================================
    # SPECIFIC ITEM DETECTION
    # =========================================================

    def _is_specific_item_request(
        self,
        message,
        intent
    ):

        user_text = (
            self._user_messages_only(message)
            .lower()
        )

        # IMPORTANT:
        # If this is already an outfit request,
        # do NOT treat "shirt" / "pants" inside it
        # as a standalone search.

        if self._is_outfit_request(
            message,
            intent
        ):
            return False

        item_words = [

            # Tops
            "shirt",
            "shirts",
            "t-shirt",
            "tshirts",
            "t shirt",
            "tee",
            "tees",
            "top",
            "tops",
            "polo",
            "polo shirt",
            "hoodie",
            "hoodies",
            "sweatshirt",
            "sweatshirts",
            "jacket",
            "jackets",
            "blazer",
            "blazers",

            # Bottoms
            "pants",
            "trousers",
            "jeans",
            "shorts",
            "chinos",
            "joggers",
            "cargo",

            # Full garments
            "dress",
            "dresses",
            "skirt",
            "skirts",
            "kurta",
            "kurtas",
            "saree",
            "sarees",
            "lehenga",
            "lehengas",

            # Footwear
            "shoes",
            "shoe",
            "sneakers",
            "boots",
            "sandals",
            "loafers",

            # Accessories
            "watch",
            "watches",
            "belt",
            "belts",
            "bag",
            "bags",
            "wallet",
            "wallets",
            "sunglasses",
            "cap",
            "caps",
        ]

        if any(
            word in user_text
            for word in item_words
        ):
            return True

        category = str(
            intent.get(
                "category",
                ""
            )
        ).lower().strip()

        if category and category not in {
            "outfit",
            "look",
            "style"
        }:

            return True

        return False

    # =========================================================
    # STANDARD QUERY CREATOR
    # =========================================================

    def create_query(
        self,
        intent
    ):

        query = []

        if intent.get("color"):

            query.append(
                str(
                    intent["color"]
                )
            )

        if intent.get("style"):

            query.append(
                str(
                    intent["style"]
                )
            )

        if intent.get("fit"):

            query.append(
                str(
                    intent["fit"]
                )
            )

        if intent.get("category"):

            query.append(
                str(
                    intent["category"]
                )
            )

        budget_amount = (
            self._extract_budget_number(
                intent.get("budget")
            )
        )

        if budget_amount is not None:

            query.append(
                f"under ₹{budget_amount}"
            )

        return " ".join(
            query
        ).strip()

    # =========================================================
    # BASE DESCRIPTORS
    # =========================================================

    def _base_descriptors(
        self,
        intent
    ):

        parts = []

        if intent.get("color"):

            parts.append(
                str(
                    intent["color"]
                )
            )

        if intent.get("style"):

            parts.append(
                str(
                    intent["style"]
                )
            )

        if intent.get("fit"):

            parts.append(
                str(
                    intent["fit"]
                )
            )

        if intent.get("occasion"):

            parts.append(
                str(
                    intent["occasion"]
                )
            )

        return " ".join(
            parts
        ).strip()



    def _detect_top_type(self, message, intent):
        """
        Detect the exact top type explicitly requested by the user.

        Priority:
        1. Explicit clothing item in the conversation.
        2. Style / occasion when no exact item was specified.
        3. Shirt as the general fallback.
        """

        user_text = self._user_messages_only(message).lower()

        # ---------------------------------------------------------
        # Explicit user request
        # ---------------------------------------------------------

        top_patterns = [
            # More specific patterns must come before plain "shirt".
            (r"\bt[\s-]?shirts?\b", "t-shirt"),
            (r"\btee[\s-]?shirts?\b", "t-shirt"),
            (r"\btees?\b", "t-shirt"),

            (r"\bpolo[\s-]?shirts?\b", "polo shirt"),
            (r"\bformal[\s-]?shirts?\b", "formal shirt"),
            (r"\bdress[\s-]?shirts?\b", "dress shirt"),

            (r"\bhoodies?\b", "hoodie"),
            (r"\bsweatshirts?\b", "sweatshirt"),
            (r"\bblazers?\b", "blazer"),
            (r"\bjackets?\b", "jacket"),

            (r"\bcasual[\s-]?shirts?\b", "casual shirt"),
            (r"\btops?\b", "top"),
            (r"\bshirts?\b", "shirt"),
        ]

        for pattern, product_type in top_patterns:
            if re.search(pattern, user_text):
                print(
                    f"👕 Detected top type : {product_type}"
                )
                return product_type

        # ---------------------------------------------------------
        # No explicit top type: use style / occasion.
        # ---------------------------------------------------------

        style = str(
            intent.get("style", "")
        ).lower()

        occasion = str(
            intent.get("occasion", "")
        ).lower()

        if "streetwear" in style or "street" in style:
            return "t-shirt"

        if "formal" in style or "formal" in occasion:
            return "formal shirt"

        if "casual" in style or "casual" in occasion:
            return "shirt"

        return "shirt"


    def _component_fallback_queries(
        self,
        intent,
        top_type,
        original_query
    ):
        """
        Build same-item fallback queries when Google Shopping
        returns zero results.

        Important: fallbacks never switch a shirt request into a
        t-shirt request (or vice versa). They only remove some
        descriptive terms while keeping the user's budget.
        """

        budget_amount = self._extract_budget_number(
            intent.get("budget")
        )

        budget_text = (
            f"under ₹{budget_amount}"
            if budget_amount is not None
            else ""
        )

        occasion = str(
            intent.get("occasion", "")
        ).strip()

        style = str(
            intent.get("style", "")
        ).strip()

        color = str(
            intent.get("color", "")
        ).strip()

        fit = str(
            intent.get("fit", "")
        ).strip()

        candidates = []

        if style and occasion:
            candidates.append(
                " ".join(
                    part for part in [
                        style,
                        occasion,
                        top_type,
                        budget_text,
                    ]
                    if part
                )
            )

        if occasion:
            candidates.append(
                " ".join(
                    part for part in [
                        occasion,
                        top_type,
                        budget_text,
                    ]
                    if part
                )
            )

        if style:
            candidates.append(
                " ".join(
                    part for part in [
                        style,
                        top_type,
                        budget_text,
                    ]
                    if part
                )
            )

        if color or fit:
            candidates.append(
                " ".join(
                    part for part in [
                        color,
                        fit,
                        top_type,
                        budget_text,
                    ]
                    if part
                )
            )

        if budget_text:
            candidates.append(
                f"{top_type} {budget_text}"
            )

        # If no budget was supplied, the exact item is still a
        # valid final fallback. With a user budget, keep every
        # fallback query within that budget.
        if budget_amount is None:
            candidates.append(top_type)

        unique = []
        seen = {original_query.strip().lower()}

        for candidate in candidates:
            candidate = " ".join(candidate.split()).strip()
            if not candidate:
                continue

            key = candidate.lower()
            if key in seen:
                continue

            seen.add(key)
            unique.append(candidate)

        return unique


    # =========================================================
    # OUTFIT COMPONENT QUERIES
    # =========================================================

    def create_component_queries(
        self,
        intent,
        message=None
    ):
        """
        Create the top and bottom searches for a normal outfit.

        The top query follows the user's explicit item request:
        t-shirt -> t-shirt, shirt -> shirt, hoodie -> hoodie, etc.
        """

        descriptors = self._base_descriptors(intent)

        budget_amount = self._extract_budget_number(
            intent.get("budget")
        )

        queries = []

        # ---------------------------------------------------------
        # Split the total outfit budget.
        # ---------------------------------------------------------

        top_budget = None
        bottom_budget = None

        if budget_amount is not None:
            top_budget = max(
                1,
                int(budget_amount * 0.45)
            )

            bottom_budget = max(
                1,
                budget_amount - top_budget
            )

        # ---------------------------------------------------------
        # TOP
        # ---------------------------------------------------------

        top_type = self._detect_top_type(
            message,
            intent
        )

        top_query_parts = []

        if descriptors:
            top_query_parts.append(
                descriptors
            )

        top_query_parts.append(
            top_type
        )

        if top_budget is not None:
            top_query_parts.append(
                f"under ₹{top_budget}"
            )

        queries.append(
            " ".join(top_query_parts)
        )

        # ---------------------------------------------------------
        # BOTTOM
        # ---------------------------------------------------------

        bottom_query_parts = []

        if descriptors:
            bottom_query_parts.append(
                descriptors
            )

        bottom_query_parts.append(
            "pants trousers"
        )

        if bottom_budget is not None:
            bottom_query_parts.append(
                f"under ₹{bottom_budget}"
            )

        queries.append(
            " ".join(bottom_query_parts)
        )

        return queries


    # =========================================================
    # PRODUCT KEY
    # =========================================================

    @staticmethod
    def _product_key(
        product
    ):

        product_id = getattr(
            product,
            "product_id",
            None
        )

        if product_id:

            return f"id:{product_id}"

        title = getattr(
            product,
            "title",
            ""
        )

        price = getattr(
            product,
            "price",
            ""
        )

        return (
            f"title:{str(title).strip().lower()}"
            f"|price:{str(price).strip().lower()}"
        )

    # =========================================================
    # DEDUPLICATE
    # =========================================================

    def _merge_products(
        self,
        product_groups
    ):

        merged = []
        seen = set()

        for products in product_groups:

            for product in products:

                key = self._product_key(
                    product
                )

                if key in seen:
                    continue

                seen.add(key)

                merged.append(
                    product
                )

        return merged

    # =========================================================
    # INTERLEAVE OUTFIT COMPONENTS
    # =========================================================

    def _interleave_products(
        self,
        product_groups
    ):

        if not product_groups:
            return []

        if len(product_groups) == 1:

            return product_groups[0]

        mixed = []

        max_length = max(
            len(group)
            for group in product_groups
        )

        for index in range(
            max_length
        ):

            for group in product_groups:

                if index < len(group):

                    mixed.append(
                        group[index]
                    )

        return mixed

    # =========================================================
    # RANK PRODUCTS
    # =========================================================

    def _rank_products(
        self,
        products,
        intent
    ):

        for product in products:

            product.score = (
                self.ranking.calculate_score(
                    product,
                    intent
                )
            )

        products.sort(
            key=lambda product:
                product.score,
            reverse=True
        )

        for index, product in enumerate(
            products
        ):

            product.rank = (
                index + 1
            )

            product.ai_pick = (
                index == 0
            )

        return products

    # =========================================================
    # SEARCH PRODUCTS
    # =========================================================

    def search_products(
        self,
        intent,
        message=None
    ):

        total_start = (
            time.perf_counter()
        )

        # =====================================================
        # DETERMINE SEARCH MODE
        # =====================================================

        complete_outfit = (
            self._is_complete_outfit_request(
                message
            )
        )

        outfit_request = (
            self._is_outfit_request(
                message,
                intent
            )
        )

        specific_item = (
            self._is_specific_item_request(
                message,
                intent
            )
        )

        # Preserve the actual component pools so they can be ranked
        # independently later without reconstructing them by position.
        outfit_component_groups = []

        # =====================================================
        # MODE 1 — COMPLETE OUTFIT
        # =====================================================

        if complete_outfit:

            query = (
                self.create_query(
                    intent
                )
            )

            # Remove generic category if AI extracted
            # "outfit", because we add it ourselves.

            category = str(
                intent.get(
                    "category",
                    ""
                )
            ).lower().strip()

            if category in {
                "outfit",
                "complete outfit",
                "look"
            }:

                query_parts = []

                if intent.get("color"):
                    query_parts.append(
                        str(intent["color"])
                    )

                if intent.get("style"):
                    query_parts.append(
                        str(intent["style"])
                    )

                if intent.get("fit"):
                    query_parts.append(
                        str(intent["fit"])
                    )

                if intent.get("occasion"):
                    query_parts.append(
                        str(intent["occasion"])
                    )

                budget_amount = (
                    self._extract_budget_number(
                        intent.get("budget")
                    )
                )

                if budget_amount is not None:
                    query_parts.append(
                        f"under ₹{budget_amount}"
                    )

                query = " ".join(
                    query_parts
                )

            if query:

                query = (
                    f"{query} complete outfit"
                )

            else:

                query = "complete outfit"

            print(
                "\n======================================"
            )

            print(
                "👔 SEARCH MODE : COMPLETE OUTFIT"
            )

            print(
                "🔍 Search Query :",
                query
            )

            print(
                "======================================\n"
            )

            shopping_start = (
                time.perf_counter()
            )

            products = (
                self.search_service.search_products(
                    query
                )
            )

            shopping_end = (
                time.perf_counter()
            )

            print(
                "🛒 Shopping Search : "
                f"{shopping_end - shopping_start:.2f}s"
            )

            # Keep the search manageable.
            products = products[
                :self.MAX_COMPLETE_OUTFIT_RESULTS
            ]

        # =====================================================
        # MODE 2 — NORMAL OUTFIT
        # =====================================================

        elif outfit_request:

            component_queries = (
                self.create_component_queries(
                    intent,
                    message
                )
            )

            print(
                "\n======================================"
            )

            print(
                "👕 SEARCH MODE : OUTFIT COMPONENTS"
            )

            print(
                "======================================"
            )

            product_groups = []

            detected_top_type = self._detect_top_type(
                message,
                intent
            )

            component_names = [
                detected_top_type.title(),
                "Pants / Trousers"
            ]

            for index, query in enumerate(
                component_queries
            ):

                component_name = (
                    component_names[index]
                )

                print(
                    f"\n🔍 {component_name} Query : "
                    f"{query}"
                )

                shopping_start = (
                    time.perf_counter()
                )

                found_products = (
                    self.search_service.search_products(
                        query
                    )
                )

                # -------------------------------------------------
                # If a component returns zero results, retry with
                # a simpler query while keeping the exact requested
                # item type and the same budget.
                # -------------------------------------------------

                if not found_products:

                    if index == 0:
                        fallback_queries = (
                            self._component_fallback_queries(
                                intent,
                                detected_top_type,
                                query
                            )
                        )
                    else:
                        budget_amount = (
                            self._extract_budget_number(
                                intent.get("budget")
                            )
                        )

                        budget_text = (
                            f"under ₹{budget_amount}"
                            if budget_amount is not None
                            else ""
                        )

                        fallback_queries = [
                            " ".join(
                                part
                                for part in [
                                    str(intent.get("occasion", "")).strip(),
                                    "pants trousers",
                                    budget_text,
                                ]
                                if part
                            ),
                            " ".join(
                                part
                                for part in [
                                    str(intent.get("style", "")).strip(),
                                    "pants trousers",
                                    budget_text,
                                ]
                                if part
                            ),
                        ]

                    for fallback_query in fallback_queries:

                        fallback_query = " ".join(
                            fallback_query.split()
                        ).strip()

                        if not fallback_query:
                            continue

                        print(
                            f"🔄 Fallback {component_name} Query : "
                            f"{fallback_query}"
                        )

                        fallback_start = time.perf_counter()

                        found_products = (
                            self.search_service.search_products(
                                fallback_query
                            )
                        )

                        fallback_end = time.perf_counter()

                        print(
                            "🛒 Fallback Search : "
                            f"{fallback_end - fallback_start:.2f}s"
                        )

                        if found_products:
                            break

                shopping_end = (
                    time.perf_counter()
                )

                print(
                    "🛒 Component Search : "
                    f"{shopping_end - shopping_start:.2f}s"
                )

                total_found = len(
                    found_products
                )

                selected_products = (
                    found_products[
                        :self.MAX_COMPONENT_RESULTS
                    ]
                )

                print(
                    f"📦 {component_name} results found : "
                    f"{total_found}"
                )

                print(
                    f"✅ {component_name} results selected : "
                    f"{len(selected_products)}"
                )

                product_groups.append(
                    selected_products
                )

            # -------------------------------------------------
            # Combine without losing the 8 + 8 balance.
            # -------------------------------------------------

            products = (
                self._merge_products(
                    product_groups
                )
            )

            # Rebuild separate pools after deduplication.
            # The original groups remain the source for
            # component balancing.
            balanced_groups = []

            for group in product_groups:

                balanced_group = []

                seen_group = set()

                for product in group:

                    key = (
                        self._product_key(
                            product
                        )
                    )

                    if key in seen_group:
                        continue

                    seen_group.add(key)

                    balanced_group.append(
                        product
                    )

                balanced_groups.append(
                    balanced_group
                )

            # Keep the groups themselves for independent ranking later.
            outfit_component_groups = balanced_groups

            products = (
                self._interleave_products(
                    balanced_groups
                )
            )

            print(
                "\n📦 Mixed Component Products : "
                f"{len(products)}"
            )

        # =====================================================
        # MODE 3 — SPECIFIC ITEM
        # =====================================================

        elif specific_item:

            query = (
                self.create_query(
                    intent
                )
            )

            print(
                "\n======================================"
            )

            print(
                "👕 SEARCH MODE : SPECIFIC ITEM"
            )

            print(
                "🔍 Search Query :",
                query
            )

            print(
                "======================================\n"
            )

            shopping_start = (
                time.perf_counter()
            )

            products = (
                self.search_service.search_products(
                    query
                )
            )

            shopping_end = (
                time.perf_counter()
            )

            print(
                "🛒 Shopping Search : "
                f"{shopping_end - shopping_start:.2f}s"
            )

            # Single-item searches get up to 16.
            products = products[
                :self.MAX_SINGLE_ITEM_RESULTS
            ]

        # =====================================================
        # MODE 4 — FALLBACK STANDARD SEARCH
        # =====================================================

        else:

            query = (
                self.create_query(
                    intent
                )
            )

            print(
                "\n======================================"
            )

            print(
                "🔎 SEARCH MODE : STANDARD"
            )

            print(
                "🔍 Search Query :",
                query
            )

            print(
                "======================================\n"
            )

            shopping_start = (
                time.perf_counter()
            )

            products = (
                self.search_service.search_products(
                    query
                )
            )

            shopping_end = (
                time.perf_counter()
            )

            print(
                "🛒 Shopping Search : "
                f"{shopping_end - shopping_start:.2f}s"
            )

            products = products[
                :self.MAX_SINGLE_ITEM_RESULTS
            ]

        # =====================================================
        # NO PRODUCTS
        # =====================================================

        if not products:

            total_end = (
                time.perf_counter()
            )

            print(
                "\n========== PRODUCTS FOUND =========="
            )

            print(
                "Count: 0"
            )

            print(
                "⚡ TOTAL : "
                f"{total_end - total_start:.2f}s"
            )

            print(
                "====================================\n"
            )

            return []

        # =====================================================
        # RANKING
        # =====================================================

        if outfit_request and not complete_outfit:

            # Rank each component pool independently so that
            # shirts and bottoms both keep their own top 8.
            # Use the original groups instead of reconstructing
            # them from the interleaved list.

            component_groups = []

            for group in outfit_component_groups:

                if group:

                    self._rank_products(
                        group,
                        intent
                    )

                    component_groups.append(
                        group
                    )

            products = (
                self._interleave_products(
                    component_groups
                )
            )

            # Assign final visible ranks.
            for index, product in enumerate(
                products
            ):

                product.rank = (
                    index + 1
                )

                product.ai_pick = (
                    index == 0
                )

        else:

            self._rank_products(
                products,
                intent
            )

        # =====================================================
        # FINAL LOG
        # =====================================================

        total_end = (
            time.perf_counter()
        )

        print(
            "\n========== PRODUCTS FOUND =========="
        )

        print(
            f"Count: {len(products)}"
        )

        print(
            "===================================="
        )

        print(
            "⚡ TOTAL : "
            f"{total_end - total_start:.2f}s\n"
        )

        return products