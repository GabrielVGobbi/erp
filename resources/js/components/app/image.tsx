import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Image component for Inertia.js + React
 * Supports lazy loading and fallback placeholder.
 *
 * @param {string} src - Path to the image relative to public (e.g. 'images/photo.jpg').
 * @param {string} alt - Alternative text for the image.
 * @param {boolean} storage - If true, prefixes src with '/storage/'.
 * @param {string} fallbackSrc - Path to fallback image if loading fails.
 * @param {string} className - CSS classes to apply.
 * @param {object} rest - Other img props.
 */
export default function Image({
    src,
    alt = '',
    storage = false,
    fallbackSrc = '',
    className = '',
    ...rest
}) {
    // Determine prefix based on storage flag
    const prefix = storage ? '/storage/' : '/';
    // Normalize initial source
    const normalize = (path) => (path.startsWith(prefix) ? path : `${prefix}${path}`);
    const [currentSrc, setCurrentSrc] = useState(() => normalize(src));

    useEffect(() => {
        setCurrentSrc(normalize(src));
    }, [src, storage]);

    const handleError = () => {
        if (fallbackSrc) {
            setCurrentSrc(normalize(fallbackSrc));
        }
    };

    // Avoid rendering with empty src to prevent reload warning
    if (!currentSrc) return null;

    return (
        <img
            src={currentSrc}
            alt={alt}
            loading="lazy"
            onError={handleError}
            className={className}
            {...rest}
        />
    );
}

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    storage: PropTypes.bool,
    fallbackSrc: PropTypes.string,
    className: PropTypes.string,
};

Image.defaultProps = {
    alt: '',
    storage: false,
    fallbackSrc: '',
    className: '',
};
