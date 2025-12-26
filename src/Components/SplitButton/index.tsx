import type { ComponentProps } from "react";

import { ADPIcon, Button, Dropdown } from "@cloudwick/astral-ui";
import clsx from "clsx";

// Methods / Hooks / Constants / Styles
import styles from "./splitButton.module.css";

type TIcon = ComponentProps<typeof ADPIcon>["icon"];

interface ISplitButtonProps {
  /**
   * Label for the primary button
   */
  label: string;

  /**
   * Icon to display in the primary button
   */
  icon?: TIcon;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * List of items for the split button
   * The first item will be triggered by the primary button
   * Remaining items will be shown in the dropdown
   */
  items: ComponentProps<typeof Dropdown.Item>[];

  /**
   * Size of the button
   */
  size?: ComponentProps<typeof Button>["size"];

  /**
   * Additional class name for the container
   */
  className?: string;
}

const SplitButton = ({
  label,
  icon,
  disabled = false,
  items,
  size = "xs",
  className
}: ISplitButtonProps ) => {

  // If no items, return null
  if ( !items || items.length === 0 ) {
    return null;
  }

  // If only one item, render a single button
  if ( items.length === 1 ) {
    return (
      <Button
        disabled={disabled}
        prefixIcon={icon}
        onClick={items[0]?.onClickHandler}
        size={size}
        className={className}
      >
        {label}
      </Button>
    );
  }

  // Split button with primary action and dropdown
  const [ primaryItem, ...dropdownItems ] = items;

  return (
    <div className={clsx( styles.splitButtonContainer, className )}>
      {/* Primary Button */}
      <Button
        disabled={disabled}
        prefixIcon={icon}
        onClick={primaryItem?.onClickHandler}
        size={size}
        className={styles.primaryButton}
      >
        {label}
      </Button>

      {/* Line Separator */}
      <div className={styles.lineSeparator} />

      {/* Dropdown Button */}
      <div className={styles.dropdownWrapper}>
        <Dropdown
          disabled={disabled}
          ctaContent={
            <button
              className={clsx( styles.dropdownButton, styles[`size_${size}`], {
                [styles.disabled]: disabled
              })}
              disabled={disabled}
              aria-label="Show more options"
            >
              <ADPIcon icon="down-arrow" size="xs" />
            </button>
          }
        >
          {dropdownItems.map(({ children, index, ...restProps }, idx ) => (
            <Dropdown.Item key={index ?? idx} {...restProps}>
              {children}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
    </div>
  );
};

export default SplitButton;

