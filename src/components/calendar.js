
import { Calendar } from '@mantine/dates';
import { useState } from 'react';

function CalendarExample() {
    const [value, setValue] = useState(null);

    return (
        <div style={{ padding: 20 }}>
            <Calendar value={value} onChange={setValue} />
            <p>Selected date: {value?.toDateString() || 'None'}</p>
        </div>
    );
}

export default CalendarExample;
