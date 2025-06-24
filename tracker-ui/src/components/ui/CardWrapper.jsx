export default function CardWrapper({ children, className = "", ...props }) {
  return (
    <div 
      className={`card-powerhouse ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
