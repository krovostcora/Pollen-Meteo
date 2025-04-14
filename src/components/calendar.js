import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

function CalendarExample() {
    // ініціалізація стану значення, яке є масивом з двох елементів або null
    const [value, setValue] = useState([null, null]);

    return (
        <div style={{ padding: 20 }}>
            {/* використовуємо DatePicker з типом range */}
            <DatePicker type="range" value={value} onChange={setValue} />
            <p>
                Selected range:<br/>
                {value[0] ? value[0].toDateString() : ''} <br/>–<br/>
                {value[1] ? value[1].toDateString() : ''}<br/>
            </p>
        </div>
    );
}

export default CalendarExample;
