import { useEffect, useMemo, useState } from 'react'
import { Button, Modal } from '@heroui/react'

import AttributeChip from './AttributeChip'
import SearchInput from './SearchInput'

import { fetchTrackAttributes } from '../../../services/enumService'
import { getColorForAttribute } from '../../../../config/Colors'

const FILTER_TYPES = ['category', 'genre', 'mood']

function getSortedAttributes(attributes = []) {
    return [...attributes].sort((a, b) =>
        getColorForAttribute(a).localeCompare(getColorForAttribute(b))
    )
}

function getSelectedFilters(filters) {
    return Object.entries(filters.includes).flatMap(([type, values = []]) =>
        values.map((value) => ({ type, value }))
    )
}

function FilterModal({
    filterType,
    options = [],
    selected = [],
    onToggle,
    onClear,
}) {
    const [search, setSearch] = useState('')

    const filteredOptions = useMemo(() => {
        return getSortedAttributes(options).filter((option) =>
            option.toLowerCase().includes(search.toLowerCase())
        )
    }, [options, search])

    if (!filterType) return null

    const filterLabel = filterType.charAt(0).toUpperCase() + filterType.slice(1)
    const selectedLabel = selected.length
        ? `${filterLabel}: ${selected[0]}${selected.length > 1 ? ` +${selected.length - 1}` : ''} ×`
        : `+ ${filterLabel}`

    return (
        <Modal>
            <Modal.Trigger>
                <Button
                    variant="bordered"
                    size="sm"
                    className={`min-h-[38px] rounded-full border-success/25 px-3 capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        selected.length
                            ? 'bg-success/10 text-success-hover'
                            : 'bg-transparent text-foreground'
                    }`}
                >
                    {selectedLabel}
                </Button>
            </Modal.Trigger>

            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="max-w-md space-y-4 border-2 border-foreground/40">
                        <Modal.CloseTrigger className="text-foreground" />

                        <Modal.Header>
                            <Modal.Heading className="capitalize">
                                Filter by {filterType}
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-4 p-2">
                            <SearchInput
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onClear={() => setSearch('')}
                                placeholder={`Search ${filterType}...`}
                            />

                            <div className="flex flex-wrap gap-2">
                                {filteredOptions.map((option) => {
                                    const isSelected = selected.includes(option)

                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() =>
                                                onToggle(filterType, option)
                                            }
                                            className="rounded-full"
                                        >
                                            <AttributeChip
                                                attribute={option}
                                                className={`transition-all duration-150 hover:opacity-90 ${
                                                    isSelected
                                                        ? 'opacity-85'
                                                        : 'opacity-60'
                                                }`}
                                            />
                                        </button>
                                    )
                                })}
                            </div>
                        </Modal.Body>

                        <Modal.Footer className="p-2">
                            <Button
                                variant="bordered"
                                size="sm"
                                onPress={() => onClear(filterType)}
                            >
                                Clear {filterType}
                            </Button>

                            <Button size="sm" slot="close">
                                Done
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

export default function TrackFilters({
    filters,
    setFilters,
    onToggleFilter,
    searchInputRef,
    onSearchChange,
    onClearSearch,
    onClearFilterType,
    onClearFilters,
}) {
    const [filterOptions, setFilterOptions] = useState({})

    const selectedFilters = useMemo(() => {
        return getSelectedFilters(filters)
    }, [filters])

    function updateSearchTerm(event) {
        if (onSearchChange) {
            onSearchChange(event.target.value)
            return
        }

        setFilters((prev) => ({
            ...prev,
            searchTerm: event.target.value,
        }))
    }

    function clearSearchTerm() {
        if (onClearSearch) {
            onClearSearch()
            return
        }

        setFilters((prev) => ({
            ...prev,
            searchTerm: '',
        }))
    }

    function clearFilterType(filterType) {
        if (onClearFilterType) {
            onClearFilterType(filterType)
            return
        }

        setFilters((prev) => ({
            ...prev,
            includes: {
                ...prev.includes,
                [filterType]: [],
            },
        }))
    }

    function clearAllFilters() {
        if (onClearFilters) {
            onClearFilters()
            return
        }

        setFilters((prev) => ({
            ...prev,
            includes: {},
            excludes: {},
        }))
    }

    useEffect(() => {
        fetchTrackAttributes()
            .then((data = {}) => setFilterOptions(data))
            .catch((error) => {
                console.error('Failed to fetch track attributes:', error)
            })
    }, [])

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <SearchInput
                    ref={searchInputRef}
                    className="min-w-[min(100%,20rem)] flex-[1_1_22rem]"
                    value={filters.searchTerm}
                    onChange={updateSearchTerm}
                    onClear={clearSearchTerm}
                    placeholder="Search tracks or creators"
                    enableShortcut
                />

                <div className="flex flex-wrap items-center gap-2">
                    {FILTER_TYPES.map((filterType) => (
                        <FilterModal
                            key={filterType}
                            filterType={filterType}
                            options={filterOptions[filterType]?.values || []}
                            selected={filters.includes[filterType] || []}
                            onToggle={onToggleFilter}
                            onClear={clearFilterType}
                        />
                    ))}

                    {selectedFilters.length > 0 && (
                        <Button
                            variant="light"
                            size="sm"
                            className="min-h-[38px] rounded-full px-2 text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            onPress={clearAllFilters}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
