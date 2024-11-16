# SimpleTimepickerRB

A lightweight and customizable timepicker plugin for jQuery that allows users to select a time in either 12-hour or 24-hour format. It provides an intuitive interface for selecting time, with options for minute increments and format preferences.

## Features

- 24-hour and 12-hour time format support
- Customizable minute increments
- Clear button to reset the time
- Popup interface for easy selection
- Easy integration with existing forms

## Installation

To use the TimepickerRB plugin, simply include the script in your project:

1. Download or clone the repository.

2. Include the **SimpleTimepickerRB** script in your HTML:

    ```html
    <script src="path/to/simple-timepicker-rb.js"></script>
    ```
   OR
    ```html
    <script src="path/to/simple-timepicker-rb.min.js"></script>
    ```

3. Include jQuery before the **SimpleTimepickerRB** script:

    ```html
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    ```

## Usage

To initialize the timepicker on an input element:

```javascript
$('#your-input').SimpleTimepickerRB({
    type: 24,   // 24-hour format, or 12 for 12-hour format
    value: '12:00',  // default time
    minuteIncrement: 5  // increment in minutes (e.g., 5, 10, etc.)
});
```

## Options

| Option            | Type    | Default   | Description                                                                |
|-------------------|---------|-----------|----------------------------------------------------------------------------|
| `type`            | `int`   | `24`      | Defines the time format: `24` for 24-hour format or `12` for 12-hour format |
| `value`           | `string`| `'00:00'` | Initial time value displayed in the input (supports `HH:mm` or `hh:mm AM/PM`) |
| `minuteIncrement` | `int`   | `5`       | The minute interval increment for time selection (e.g., 5, 10, etc.)       |


## License

**Free to use (with attribution)**  
You can freely use, modify, and distribute this plugin, but please include proper attribution to the author in your project.

**Author:** Reynaldo S. Batac Jr.  
**Email:** [reynaldo.batac@icloud.com](mailto:reynaldo.batac@icloud.com)

## Limitations

- The plugin requires jQuery to function properly.
- Some browsers may have inconsistencies in handling time formats; please ensure proper testing across different environments.
- Custom styles may need to be applied for full theme integration.

## Contributing

Feel free to fork the repository and submit pull requests if you have any improvements or bug fixes. All contributions are welcome!
