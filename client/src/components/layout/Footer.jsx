function Footer() {
  return (
    <footer
      className="
        w-full
        shrink-0
        bg-white
        border-t
        border-gray-200
        px-6
        py-4
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          w-full
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-2
        "
      >

        {/* ==================================================
            PROJECT
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <span
            className="
              text-sm
              font-bold
              text-gray-700
            "
          >
            CRM360
          </span>

          <span className="text-gray-300">
            •
          </span>

          <span
            className="
              text-xs
              text-gray-500
            "
          >
            Customer Relationship Management
          </span>

        </div>


        {/* ==================================================
            CREATOR
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-gray-400
          "
        >

          <span>
            Designed &amp; Developed by
          </span>

          <span
            className="
              font-semibold
              text-gray-600
            "
          >
            Sanket
          </span>

          <span>
            •
          </span>

          <span>
            © 2026
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;