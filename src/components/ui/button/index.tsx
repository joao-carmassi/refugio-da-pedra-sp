import './style.css';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Spinner } from '../spinner';

/**
 * @author: @joao-carmassi
 * @description: Slide Text Button with animated vertical text transition
 * @version: 1.0.0
 * @date: 2026-22-02
 * @license: MIT
 * @website: https://joao-carmassi.github.io/enhanced-button-v4/
 * @github: https://github.com/joao-carmassi/enhanced-button-v4
 */

interface IconProps {
  icon: React.ElementType;
  iconPlacement: 'left' | 'right';
}

interface IconRefProps {
  icon?: never;
  iconPlacement?: undefined;
}

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:ring-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:ring-destructive/90',
        outline:
          'border bg-card shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:ring-accent/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:ring-secondary/90',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 hover:ring-accent/90',
        link: 'text-primary underline-offset-4 hover:underline hover:ring-primary/90',
      },
      effect: {
        expandIcon: 'group gap-0 relative',
        ringHover:
          'transition-all duration-300 hover:ring-2 hover:ring-offset-2 ring-offset-background',
        shine:
          'before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat',
        shineHover:
          'relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000',
        gooeyRight:
          'relative z-0 overflow-hidden duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:from-white/40 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%]',
        gooeyLeft:
          'relative z-0 overflow-hidden duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:from-white/40 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]',
        underline:
          'relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300',
        hoverUnderline:
          'relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300',
        pulsating: 'animate-button-pulsating',
        rainbow:
          'relative animate-rainbow hover:brightness-110 border-0 bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,oklch(66.2%_0.225_25.9),oklch(90.7%_0.231_133),oklch(69.6%_0.165_251),oklch(80.2%_0.134_225),oklch(60.4%_0.26_302))] bg-[length:200%] text-primary-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,oklch(66.2%_0.225_25.9),oklch(90.7%_0.231_133),oklch(69.6%_0.165_251),oklch(80.2%_0.134_225),oklch(60.4%_0.26_302))] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,oklch(66.2%_0.225_25.9),oklch(90.7%_0.231_133),oklch(69.6%_0.165_251),oklch(80.2%_0.134_225),oklch(60.4%_0.26_302))]',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  effect,
  icon: Icon,
  iconPlacement,
  asChild = false,
  loading = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> &
  ButtonIconProps & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';
  const isIconSize = size?.startsWith('icon');

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({ variant, effect, size, className }),
        loading && effect === 'expandIcon' && 'gap-2',
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {!loading &&
        Icon &&
        iconPlacement === 'left' &&
        (effect === 'expandIcon' ? (
          <div className='w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pr-2 group-hover:opacity-100'>
            <Icon />
          </div>
        ) : (
          <Icon />
        ))}
      {!(loading && isIconSize) && <Slottable>{props.children}</Slottable>}
      {loading && <Spinner />}
      {!loading &&
        Icon &&
        iconPlacement === 'right' &&
        (effect === 'expandIcon' ? (
          <div className='w-0 translate-x-full pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100'>
            <Icon />
          </div>
        ) : (
          <Icon />
        ))}
    </Comp>
  );
}

export { Button, buttonVariants };
