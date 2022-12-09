import Link from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';

export type INavLink = React.ComponentPropsWithoutRef<'a'> & {
  href: string;
  activeClassName?: string;
};

const NavLink = forwardRef<HTMLAnchorElement, INavLink>((props, ref) => {
  const { asPath } = useRouter();
  const { children, href, className, activeClassName, ...rest } = props;

  return (
    <Link href={href}>
      <a
        ref={ref}
        className={`${className} ${asPath.includes(href) && activeClassName}`}
        {...rest}
      >
        {children}
      </a>
    </Link>
  );
});
NavLink.displayName = 'NavLink';

export default NavLink;
