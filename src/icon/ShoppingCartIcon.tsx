type IconProps = {
  size?: number
  className?: string
}

export default function ShoppingCartIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M1.53754 1.53735H3.03754L5.03254 10.8524C5.10572 11.1935 5.29554 11.4985 5.56932 11.7147C5.8431 11.931 6.18372 12.0451 6.53254 12.0374H13.8675C14.2089 12.0368 14.5399 11.9198 14.8058 11.7057C15.0717 11.4916 15.2566 11.1933 15.33 10.8599L16.5675 5.28735H3.84004M6.75 15.75C6.75 16.1642 6.41421 16.5 6 16.5C5.58579 16.5 5.25 16.1642 5.25 15.75C5.25 15.3358 5.58579 15 6 15C6.41421 15 6.75 15.3358 6.75 15.75ZM15 15.75C15 16.1642 14.6642 16.5 14.25 16.5C13.8358 16.5 13.5 16.1642 13.5 15.75C13.5 15.3358 13.8358 15 14.25 15C14.6642 15 15 15.3358 15 15.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
