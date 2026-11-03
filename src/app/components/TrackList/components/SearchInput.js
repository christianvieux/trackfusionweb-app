import { Label, SearchField } from '@heroui/react'

export default function SearchInput({
    value = '',
    onChange,
    onClear,
    className = '',
    placeholder = 'Search tracks...',
}) {
    return (
        <SearchField name="track-search" className={className}>
            <Label className="sr-only">Search tracks</Label>

            <SearchField.Group className="min-h-[42px] rounded-[11px] border border-transparent bg-white/[.035] focus-within:border-success focus-within:shadow-[0_0_0_3px_rgba(34,197,94,.15)]">
                <SearchField.SearchIcon />

                <SearchField.Input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full text-sm"
                />

                <SearchField.ClearButton onPress={onClear} />
            </SearchField.Group>
        </SearchField>
    )
}
