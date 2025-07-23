import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#f0f7f9',
                    100: '#dbeef2',
                    200: '#bcdde6',
                    300: '#8ec4d4',
                    400: '#59a2bb',
                    500: '#3d85a1',
                    600: '#356d87',
                    700: '#2f5a6f',
                    800: '#2c4c5c',
                    900: '#0d232d', // Sua cor principal
                    950: '#081a21',
                },
                secondary: {
                    50: '#f8f9f6',
                    100: '#f1f3ec',
                    200: '#e4e8db',
                    300: '#d3dcc1', // Sua cor secundária
                    400: '#bcc8a4',
                    500: '#a3b187',
                    600: '#8a9a6e',
                    700: '#6f7c59',
                    800: '#5a634a',
                    900: '#4a523e',
                    950: '#262c1f',
                },
            },
        },
    },

    plugins: [forms],
};