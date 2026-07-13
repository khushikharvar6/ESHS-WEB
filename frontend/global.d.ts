declare module 'next/image' {
  const Image: any;
  export default Image;
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/navigation' {
  export const usePathname: () => string;
  export const useRouter: () => any;
  export const useSearchParams: () => any;
  export const useParams: () => any;
  export const redirect: (url: string) => void;
  export const notFound: () => void;
}
