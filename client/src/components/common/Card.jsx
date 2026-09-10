// ============================================================
// REUSABLE CARD
// A generic surface used to wrap dashboard/report content.
// Sub-components: Card.Header, Card.Title, Card.Subtitle, Card.Body, Card.Footer
// ============================================================

function Card({
  children,
  className = "",
  padding = true,
  hoverable = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-2xl
        border border-gray-200
        shadow-sm
        ${padding ? "p-4" : ""}
        ${hoverable ? "transition-shadow hover:shadow-md cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`flex items-center justify-between mb-3 ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-base font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
}

function CardSubtitle({ children, className = "" }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
  );
}

function CardBody({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`mt-3 pt-3 border-t border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
