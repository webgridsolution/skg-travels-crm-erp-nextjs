import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
export function Icon({ icon, className, size }: { icon: IconDefinition; className?: string; size?: 'xs'|'sm'|'lg'|'xl' }) { return <FontAwesomeIcon icon={icon} className={className} size={size} aria-hidden="true" />; }
