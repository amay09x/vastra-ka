import {
  ArrowLeft,
  Check,
  ExternalLink,
  Loader2,
  Sparkles,
  Star,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();

  const initialProduct = location.state?.product || null;
  const userRequest = location.state?.userRequest || "";

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDetails = async () => {
      if (!productId) {
        setError("Product was not found.");
        setLoading(false);
        return;
      }

      try {
        if (initialProduct) {
          sessionStorage.setItem(
            `vastra-product-${productId}`,
            JSON.stringify({
              product: initialProduct,
              userRequest,
            })
          );
        }

        const storedProductData =
          JSON.parse(
            sessionStorage.getItem(
              `vastra-product-${productId}`
            ) || "null"
          );

        const cachedProduct =
          initialProduct ||
          storedProductData?.product ||
          storedProductData ||
          null;

        const cachedUserRequest =
          userRequest ||
          storedProductData?.userRequest ||
          "";

        if (!userRequest && cachedUserRequest) {
          // The request is kept for refresh/deep-link continuity.
        }

        if (cachedProduct && !product) {
          setProduct(cachedProduct);
        }

        const response = await fetch(
          `${API_URL}/product-details`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              product_id: productId,
              immersive_api:
                cachedProduct?.immersive_api || null,
              title: cachedProduct?.title || null,
              source: cachedProduct?.source || null,
              brand: cachedProduct?.brand || null,
              thumbnail:
                cachedProduct?.thumbnail || null,
              images: cachedProduct?.images || [],
              price: cachedProduct?.price || null,
              original_price:
                cachedProduct?.original_price || null,
              extracted_price:
                cachedProduct?.extracted_price ?? null,
              extracted_original_price:
                cachedProduct?.extracted_original_price ?? null,
              product_link:
                cachedProduct?.product_link || null,
              extensions:
                cachedProduct?.extensions || [],
              rating: cachedProduct?.rating ?? null,
              review_count:
                cachedProduct?.review_count ?? null,
              customer_reviews:
                cachedProduct?.customer_reviews || [],
              score: cachedProduct?.score ?? null,
              value_score:
                cachedProduct?.value_score ?? null,
              trend_score:
                cachedProduct?.trend_score ?? null,
              score_breakdown:
                cachedProduct?.score_breakdown || {},
              why_recommended:
                cachedProduct?.why_recommended || [],
              user_request: cachedUserRequest,
            }),
          }
        );

        const raw = await response.text();
        const data = raw ? JSON.parse(raw) : {};

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Could not load product details."
          );
        }

        if (!cancelled && data?.product) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error(
          "VASTRA → Product detail error:",
          err
        );

        if (!cancelled && !initialProduct) {
          setError(
            err?.message ||
              "Could not load product details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const image =
    product?.thumbnail ||
    product?.images?.[0] ||
    "";

  const name =
    product?.title ||
    "Fashion Product";

  const brand =
    product?.brand ||
    product?.source ||
    "";

  const rating = product?.rating;
  const reviews =
    product?.reviews ??
    product?.review_count;

  const price =
    product?.price ||
    product?.price_range ||
    "";

  const score = product?.score;
  const valueScore = product?.value_score;
  const trendScore = product?.trend_score;

  const customerReviews = Array.isArray(
    product?.customer_reviews
  )
    ? product.customer_reviews
    : [];

  const reviewStyleTakeaways = Array.isArray(
    product?.review_style_takeaways
  )
    ? product.review_style_takeaways
    : [];

  const goodToKnow = Array.isArray(
    product?.good_to_know
  )
    ? product.good_to_know
    : [];

  const pairingIdeas = Array.isArray(
    product?.pairing_ideas
  )
    ? product.pairing_ideas
    : [];

  const stores = Array.isArray(
    product?.stores
  )
    ? product.stores
    : [];

  const features = Array.isArray(
    product?.features
  )
    ? product.features
    : [];

  const productFacts = useMemo(() => {
    return features.filter(
      (item) =>
        item?.name ||
        item?.value
    );
  }, [features]);

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#99958D]">
          <Loader2
            size={18}
            className="animate-spin text-[#D4AF37]"
          />
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product && error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white px-6 py-10">
        <button
          onClick={() => navigate("/chat", { replace: true })}
          className="flex items-center gap-2 text-sm text-[#99958D] hover:text-[#D4AF37] transition"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="mx-auto mt-16 max-w-xl rounded-3xl border border-white/[0.07] bg-[#111111] p-10 text-center">
          <p className="text-[#DDD7CC]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#050505] text-white"
    >
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        <button
          onClick={() => navigate("/chat", { replace: true })}
          className="flex items-center gap-2 text-sm text-[#99958D] hover:text-[#D4AF37] transition"
        >
          <ArrowLeft size={17} />
          Back to results
        </button>

        {/* =====================================================
            HERO
        ===================================================== */}

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-14">

          <div className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#111111]">
            {image ? (
              <img
                src={image}
                alt={name}
                className="aspect-[4/5] h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center text-sm text-white/25">
                No image available
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {brand && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77736C]">
                {brand}
              </p>
            )}

            <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#F1ECE2] sm:text-4xl">
              {name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <Star
                size={17}
                fill="#D4AF37"
                color="#D4AF37"
              />

              {rating !== null &&
              rating !== undefined &&
              rating !== "" ? (
                <span className="text-[#E9E3D9]">
                  {rating}
                </span>
              ) : (
                <span className="text-[#77736D]">
                  No rating
                </span>
              )}

              {reviews !== null &&
                reviews !== undefined &&
                reviews !== "" && (
                  <span className="text-[#706C65]">
                    · {reviews} reviews
                  </span>
                )}
            </div>

            {price && (
              <p className="mt-6 text-3xl font-bold text-white">
                {price}
              </p>
            )}

            {/* VASTRA SCORE */}
            {score !== null &&
              score !== undefined && (
                <div className="mt-7 rounded-3xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                      <Sparkles size={13} />
                      VASTRA SCORE
                    </div>

                    <span className="text-xl font-bold text-[#E7D276]">
                      {score}/100
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#D4AF37]"
                      style={{
                        width: `${Math.min(
                          Math.max(Number(score) || 0, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  {(valueScore !== null ||
                    trendScore !== null) && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {valueScore !== null &&
                        valueScore !== undefined && (
                          <div className="rounded-2xl border border-white/[0.05] bg-black/20 p-3">
                            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-[#77736D]">
                              <WalletCards size={11} />
                              Value
                            </div>
                            <p className="mt-1 text-sm font-semibold text-[#DCD6CA]">
                              {valueScore}/100
                            </p>
                          </div>
                        )}

                      {trendScore !== null &&
                        trendScore !== undefined && (
                          <div className="rounded-2xl border border-white/[0.05] bg-black/20 p-3">
                            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-[#77736D]">
                              <TrendingUp size={11} />
                              Trend
                            </div>
                            <p className="mt-1 text-sm font-semibold text-[#DCD6CA]">
                              {trendScore}/100
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>

        {/* =====================================================
            WHAT YOU'RE GETTING
        ===================================================== */}

        {productFacts.length > 0 && (
          <section className="mt-10 rounded-3xl border border-white/[0.07] bg-[#111111] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#F0EBE2]">
              What You're Getting
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {productFacts.map((fact, index) => (
                <div
                  key={`${fact.name}-${index}`}
                  className="rounded-2xl border border-white/[0.05] bg-[#181818] p-4"
                >
                  <p className="text-[9px] uppercase tracking-[0.12em] text-[#69655E]">
                    {fact.name}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#DCD6CB]">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            GOOD TO KNOW
        ===================================================== */}

        {goodToKnow.length > 0 && (
          <section className="mt-6 rounded-3xl border border-white/[0.07] bg-[#111111] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#F0EBE2]">
              Good to Know
            </h2>

            <div className="mt-5 space-y-3">
              {goodToKnow.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-start gap-3 text-sm leading-6 text-[#AAA59C]"
                >
                  <Check
                    size={16}
                    className="mt-1 flex-none text-[#D4AF37]"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            HOW IT FITS
        ===================================================== */}

        {product?.how_it_fits && (
          <section className="mt-6 rounded-3xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
              <Sparkles size={13} />
              How It Fits Your Request
            </div>

            <p className="mt-4 max-w-4xl text-[15px] leading-7 text-[#B8B3AA]">
              {product.how_it_fits}
            </p>
          </section>
        )}

        {/* =====================================================
            CUSTOMER REVIEWS
        ===================================================== */}

        {(customerReviews.length > 0 ||
          reviewStyleTakeaways.length > 0) && (
          <section className="mt-6 rounded-3xl border border-white/[0.07] bg-[#111111] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#F0EBE2]">
                  What People Are Saying
                </h2>
                <p className="mt-1 text-[11px] text-[#6F6A62]">
                  {customerReviews.length > 0
                    ? "Customer review excerpts"
                    : "AI-generated review-style previews based on the available product information"}
                </p>
              </div>

              <Star
                size={18}
                fill="#D4AF37"
                color="#D4AF37"
                className="mt-1 flex-none"
              />
            </div>

            {customerReviews.length > 0 ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {customerReviews.map((review, index) => (
                  <div
                    key={`${review?.author || "review"}-${index}`}
                    className="rounded-2xl border border-white/[0.05] bg-[#181818] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {review?.rating !== null &&
                        review?.rating !== undefined &&
                        review?.rating !== "" ? (
                          <div className="flex items-center gap-1 text-xs text-[#E4DDCF]">
                            <Star
                              size={13}
                              fill="#D4AF37"
                              color="#D4AF37"
                            />
                            {review.rating}
                          </div>
                        ) : null}

                        {review?.date && (
                          <span className="text-[10px] text-[#67635C]">
                            {review.date}
                          </span>
                        )}
                      </div>

                      {review?.verified === true && (
                        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8D897F]">
                          Verified
                        </span>
                      )}
                    </div>

                    {review?.title && (
                      <p className="mt-3 text-sm font-semibold text-[#DED8CD]">
                        {review.title}
                      </p>
                    )}

                    <p className="mt-3 text-sm leading-6 text-[#AAA59C]">
                      {review?.text || "No review text available."}
                    </p>

                    {review?.author && (
                      <p className="mt-4 text-[10px] uppercase tracking-[0.1em] text-[#69655E]">
                        — {review.author}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {reviewStyleTakeaways.map((review, index) => (
                  <div
                    key={`${review}-${index}`}
                    className="rounded-2xl border border-[#D4AF37]/10 bg-[#181818] p-5"
                  >
                    <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#D4AF37]">
                      <Sparkles size={12} />
                      Review-style takeaway
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#AAA59C]">
                      {review}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            VASTRA ADVICE
        ===================================================== */}

        {product?.vastra_advice && (
          <section className="mt-6 rounded-3xl border border-[#D4AF37]/15 bg-[#111111] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                <Sparkles size={17} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#F0EBE2]">
                  VASTRA Advice
                </h2>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#6F6A62]">
                  A practical way to wear it
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-4xl text-[15px] leading-8 text-[#B8B3AA]">
              {product.vastra_advice}
            </p>
          </section>
        )}

        {/* =====================================================
            BEST WITH
        ===================================================== */}

        {pairingIdeas.length > 0 && (
          <section className="mt-6 rounded-3xl border border-white/[0.07] bg-[#111111] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#F0EBE2]">
              Best With
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {pairingIdeas.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-white/[0.07] bg-[#181818] px-4 py-2.5 text-sm text-[#AAA59C]"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            PRICE & AVAILABILITY
        ===================================================== */}

        {stores.length > 0 && (
          <section className="mt-6 mb-10 rounded-3xl border border-white/[0.07] bg-[#111111] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#F0EBE2]">
              Price & Availability
            </h2>

            <div className="mt-5 space-y-3">
              {stores.map((store, index) => (
                <a
                  key={`${store?.store}-${index}`}
                  href={store?.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-[#181818] p-4 transition hover:border-[#D4AF37]/35"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#E6E0D5]">
                      {store?.store || "Store"}
                    </p>

                    {store?.price && (
                      <p className="mt-1 text-sm font-semibold text-[#D4AF37]">
                        {store.price}
                      </p>
                    )}

                    {store?.title && (
                      <p className="mt-1 truncate text-xs text-[#77736D]">
                        {store.title}
                      </p>
                    )}
                  </div>

                  <ExternalLink
                    size={16}
                    className="flex-none text-[#D4AF37]"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {loading && product && (
          <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.08] bg-[#111111]/95 px-4 py-2.5 text-xs text-[#8D8981] shadow-2xl backdrop-blur">
            <Loader2
              size={13}
              className="animate-spin text-[#D4AF37]"
            />
            Loading more details
          </div>
        )}
      </div>
    </motion.main>
  );
}

export default ProductDetails;
