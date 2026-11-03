'use client'

import {
    forwardRef,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
} from 'react'
import { Search, X } from 'lucide-react'

function isTypingTarget(target) {
    if (!(target instanceof HTMLElement)) return false

    return (
        target.matches('input, textarea, select') ||
        target.isContentEditable ||
        Boolean(target.closest('[contenteditable="true"]'))
    )
}

const SearchInput = forwardRef(function SearchInput(
    {
        value = '',
        onChange,
        onClear,
        className = '',
        placeholder = 'Search tracks or creators',
        label = 'Search tracks',
        enableShortcut = false,
        name = 'track-search',
    },
    forwardedRef
) {
    const inputRef = useRef(null)
    const inputId = useId()

    useImperativeHandle(forwardedRef, () => inputRef.current)

    useEffect(() => {
        if (!enableShortcut) return undefined

        function focusSearch(event) {
            if (
                event.defaultPrevented ||
                event.key !== '/' ||
                event.metaKey ||
                event.ctrlKey ||
                event.altKey ||
                isTypingTarget(event.target)
            ) {
                return
            }

            event.preventDefault()
            inputRef.current?.focus()
        }

        document.addEventListener('keydown', focusSearch)
        return () => document.removeEventListener('keydown', focusSearch)
    }, [enableShortcut])

    function clearAndFocus() {
        onClear?.()
        requestAnimationFrame(() => inputRef.current?.focus())
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape' && value) {
            event.preventDefault()
            clearAndFocus()
        }
    }

    return (
        <div className={`track-search ${className}`}>
            <label htmlFor={inputId} className="sr-only">
                {label}
            </label>

            <Search aria-hidden="true" className="track-search-icon" />
            <input
                ref={inputRef}
                id={inputId}
                name={name}
                type="search"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-keyshortcuts={enableShortcut ? '/' : undefined}
                className="track-search-input"
            />

            {value ? (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={clearAndFocus}
                    className="track-search-clear"
                >
                    <X aria-hidden="true" className="size-4" />
                </button>
            ) : enableShortcut ? (
                <kbd className="track-search-shortcut" aria-hidden="true">
                    /
                </kbd>
            ) : null}
        </div>
    )
})

SearchInput.displayName = 'SearchInput'

export default SearchInput
