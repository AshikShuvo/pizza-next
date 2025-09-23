#!/bin/bash

# Script to easily switch default language for development

if [ "$1" = "en" ] || [ "$1" = "no" ]; then
    echo "Setting default language to: $1"
    echo "NEXT_PUBLIC_DEFAULT_LOCALE=$1" > .env.local
    echo "Environment variable set. Restart your development server to apply changes."
    echo "Run: npm run dev"
elif [ "$1" = "check" ]; then
    if [ -f .env.local ]; then
        echo "Current default language:"
        cat .env.local | grep NEXT_PUBLIC_DEFAULT_LOCALE
    else
        echo "No .env.local file found. Using default: en"
    fi
else
    echo "Usage: $0 [en|no|check]"
    echo "  en    - Set English as default language"
    echo "  no    - Set Norwegian as default language"
    echo "  check - Check current default language"
fi
