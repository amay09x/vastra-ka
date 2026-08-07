function SectionTitle({

    title,

    subtitle,

}) {

    return (

        <div className="mb-12">

            <h2 className="text-5xl font-bold">

                {title}

            </h2>

            <p className="mt-5 text-[#B5B5B5] text-lg">

                {subtitle}

            </p>

        </div>

    );

}

export default SectionTitle;