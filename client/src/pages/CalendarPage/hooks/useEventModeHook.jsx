

/**
 * Enum representing the different types of actions.
 * @enum {string}
 */
export const EventModeEnum = {
    ADD: 'create',
    UNAVAILABILITY: 'update'
};

export default function useEventModeHook () {
    const [eventMode, setEventMode] = useState(EventModeEnum.ADD);
    
    return {
        eventMode,
        setEventMode
    };
}