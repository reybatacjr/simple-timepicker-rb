(function($) {
    $.fn.SimpleTimepickerRB = function(options) {
        // Default options
        var settings = $.extend({
            type: 24,    // default to 24-hour format
            value: '00:00',    // default value for the time
            minuteIncrement: 5
        }, options);  // Merge user-provided options with defaults

        // Private function to validate time format (24-hour or 12-hour format)
        function isValidTime(time, type) {
            if (type === 24) {
                // Validate 24-hour time format (HH:mm)
                const regex24 = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
                return regex24.test(time);
            } else if (type === 12) {
                // Validate 12-hour time format (hh:mm AM/PM)
                const regex12 = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
                return regex12.test(time);
            }
            return false; // Invalid type
        }

        // Private function to convert 24-hour time to 12-hour time format and add AM/PM
        function convertTo12HourFormat(time) {
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours, 10);
            let suffix = 'AM';
            
            if (hour === 0) {
                hour = 12; // Midnight case
            } else if (hour === 12) {
                suffix = 'PM'; // Noon case
            } else if (hour > 12) {
                hour -= 12;
                suffix = 'PM';
            }
            
            // Pad single digit hours or minutes with leading zeros
            const formattedHour = (hour < 10 ? '0' : '') + hour;
            const formattedTime = `${formattedHour}:${minutes} ${suffix}`;
            
            return formattedTime;
        }

        function adjustTime(timeString, addNumber, interval, operation = 'add', format = '12') {
            // Split the time string into components (hours, minutes, and AM/PM)
            const [time, period] = timeString.split(' ');
            let [hours, minutes] = time.split(':');
          
            // Convert hours and minutes to integers
            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);
          
            // Convert hours to 24-hour format based on AM/PM
            if (period === 'PM' && hours !== 12) {
                hours += 12;  // Convert PM hour to 24-hour format
            } else if (period === 'AM' && hours === 12) {
                hours = 0;  // 12 AM should be 0 hours (midnight)
            }
          
            // Convert the time string to a Date object
            const date = new Date(1970, 0, 1, hours, minutes);
          
            // Adjust time based on operation (add or subtract)
            if (interval === 'hour') {
                if (operation === 'add') {
                    date.setHours(date.getHours() + addNumber);
                } else {
                    date.setHours(date.getHours() - addNumber);
                }
            } else if (interval === 'minute') {
                if (operation === 'add') {
                    date.setMinutes(date.getMinutes() + addNumber);
                } else {
                    date.setMinutes(date.getMinutes() - addNumber);
                }
            }
        
            // Handle 12-hour or 24-hour format
            if (format == '12') {
                // Convert back to 12-hour format (adjust AM/PM)
                let newHours = date.getHours();
                const ampm = newHours >= 12 ? 'PM' : 'AM';
                if (newHours > 12) newHours -= 12; // Convert to 12-hour format
                if (newHours === 0) newHours = 12;  // Handle midnight (12 AM) case
            
                // Format the time in 12-hour format
                const result = interval === 'hour'
                    ? newHours
                    : date.getMinutes();
        
                // Ensure two-digit format
                return String(result).padStart(2, '0');
            } else if (format == '24') {
                // 24-hour format (no AM/PM)
                const result = interval === 'hour'
                    ? date.getHours()
                    : date.getMinutes();
            
                // Ensure two-digit format
                return String(result).padStart(2, '0');
            }
        }
        

        return this.each(function() {
            var inputElement = $(this);
            var inputContainer = inputElement.parent();
            var inputWidth = inputElement.outerWidth();  // Get the width of the input
            var inputHeight = inputElement.outerHeight();  // Get the height of the input

            // Create a wrapper for the timepicker
            var timepicker_wrapper = $('<div class="textbox-rb_wrapper"></div>');
            var timepicker_content = $('<div class="textbox-rb_content"></div>');
            var timeDisplay = $('<span class="time-display"></span>');  // Span to hold the time display value

            // Append the input element inside timepicker_content
            inputElement.appendTo(timepicker_content);
            timeDisplay.appendTo(timepicker_content);  // Append time display to the content

            // Add styling for the wrapper and content
            timepicker_wrapper.css({
                'padding': '3px',
                'border': '1px solid #ccc',  // Grey border
                'border-radius': '8px',     // Rounded corners (5px radius)
                'display': 'inline-flex',
                'align-items': 'center',
                'background-color': '#f9f9f9',
                'position': 'relative',      // For positioning the clear button
                'font-family': 'Arial, sans-serif',
                'width': inputWidth + 'px',  // Set the width to match the input
                'height': inputHeight + 'px' // Set the height to match the input
            });

            timepicker_content.css({
                'flex-grow': 1,               // Allow the content to expand
                'padding-left': '5px',
                'font-size': '14px',          // Keep consistent font size
                'line-height': '20px'         // Keep content vertically centered
            });

            var valueToUse = settings.value || inputElement.val();
            inputElement.attr('value', valueToUse);

            // If type is 12-hour and no AM/PM is provided, convert 24-hour time to 12-hour time
            if (settings.type === 12 && !/(AM|PM)/i.test(valueToUse)) {
                valueToUse = convertTo12HourFormat(valueToUse); // Convert and add AM/PM
            }

            if (isValidTime(valueToUse, settings.type)) {
                timeDisplay.text(valueToUse);  // Update only the text in timeDisplay
            } else {
                timeDisplay.text('Invalid Time'); // Display an error message if time is invalid
            }

            var clearButton = $('<button></button>')
                .text('X')
                .css({
                    'position': 'absolute',
                    'right': '5px',
                    'top': '50%',
                    'transform': 'translateY(-50%)',
                    'cursor': 'pointer',
                    'width': '20px',
                    'height': '20px',
                    'border': 'none',
                    'border-radius': '5px',
                    'background-color': '#f1f1f1',
                    'color': '#888',
                    'font-size': '14px',
                    'display': 'flex',
                    'justify-content': 'center',
                    'align-items': 'center',
                    'text-align': 'center'
                })
                .on('click', function() {
                    if(settings.type === 12) {
                        timeDisplay.text('00:00 AM');  // Set value to '00:00'
                    } else {
                        timeDisplay.text('00:00');  // Set value to '00:00'
                    }
                });

            // Append the timepicker content and clear button to the wrapper
            timepicker_wrapper.append(timepicker_content);
            timepicker_wrapper.append(clearButton);

            // Increase buttons for hour and minute
            var increaseHour = $('<button>↑</button>')  // Increase hour button
                .css({
                    'cursor': 'pointer',
                    'font-size': '18px',
                    'border': 'none',
                    'background-color': '#f1f1f1',
                    'flex': '1',
                    'padding': '5px',
                    'text-align': 'center'
                })
                .on('click', function() {
                    var currentTime = hourInput.val() + ":" + minuteInput.val();
                    hourInput.val( adjustTime(currentTime, 1, "hour", "add", settings.type) );
                });

            var increaseMinute = $('<button>↑</button>')  // Increase minute button
                .css({
                    'cursor': 'pointer',
                    'font-size': '18px',
                    'border': 'none',
                    'background-color': '#f1f1f1',
                    'flex': '1',
                    'padding': '5px',
                    'text-align': 'center',
                    'margin-left': '17px',
                    'margin-right': '17px'
                })
                .on('click', function() {
                    var currentTime = hourInput.val() + ":" + minuteInput.val();
                    minuteInput.val( adjustTime(currentTime, settings.minuteIncrement, "minute", "add", settings.type) );
                });

            // Hour and minute input (both text)
            var hourInput = $('<input type="text" placeholder="Hour" />')
                .val(valueToUse.split(':')[0])
                .css({
                    'width': '26%',
                    'padding': '5px',
                    'border': '1px solid #ccc',
                    'border-radius': '4px',
                    'font-size': '24px',
                });

            var separator = $('<span>:</span>')
                .css({
                    'font-size': '24px'
                });

            var minuteInput = $('<input type="text" placeholder="Minute" />')
                .css({
                    'width': '26%',
                    'padding': '5px',
                    'border': '1px solid #ccc',
                    'border-radius': '4px',
                    'font-size': '24px',
                });

            minuteInput.val(settings.type === 12 ? valueToUse.split(':')[1].split(' ')[0] : valueToUse.split(':')[1]);

            // Add the AM/PM toggle button
            var amPmToggle = $('<span></span>')
                .css({
                    'font-size': '18px',
                    'border': 'none',
                    'background-color': '#f1f1f1',
                    'cursor': 'pointer',
                    'text-align': 'center',
                    'border-radius': '4px',
                    'font-size': '10px'
                })
                .on('click', function() {
                    // Toggle AM/PM state
                    var currentVal = timeDisplay.text();
                    if (currentVal.includes('AM')) {
                        timeDisplay.text(currentVal.replace('AM', 'PM'));
                        amPmToggle.text(timeDisplay.text().split(' ')[1]);
                    } else {
                        timeDisplay.text(currentVal.replace('PM', 'AM'));
                        amPmToggle.text(timeDisplay.text().split(' ')[1]);
                    }
                });

            if(settings.type === 12) {
                amPmToggle.text(valueToUse.split(':')[1].split(' ')[1]);
            }

            // Decrease buttons for hour and minute
            var decreaseHour = $('<button>↓</button>')  // Decrease hour button
                .css({
                    'cursor': 'pointer',
                    'font-size': '18px',
                    'border': 'none',
                    'background-color': '#f1f1f1',
                    'flex': '1',
                    'padding': '5px',
                    'text-align': 'center'
                })
                .on('click', function() {
                    var currentTime = hourInput.val() + ":" + minuteInput.val();
                    hourInput.val( adjustTime(currentTime, 1, "hour", "subtract", settings.type) );
                });

            var decreaseMinute = $('<button>↓</button>')  // Decrease minute button
                .css({
                    'cursor': 'pointer',
                    'font-size': '18px',
                    'border': 'none',
                    'background-color': '#f1f1f1',
                    'flex': '1',
                    'padding': '5px',
                    'text-align': 'center',
                    'margin-left': '17px',
                    'margin-right': '17px'
                })
                .on('click', function() {
                    var currentTime = hourInput.val() + ":" + minuteInput.val();
                    minuteInput.val( adjustTime(currentTime, settings.minuteIncrement, "minute", "subtract", settings.type) );
                });

            // OK Button to save time
            var okButton = $('<button>OK</button>') 
                .css({
                    'width': '100%',
                    'padding': '8px',
                    'background-color': '#4CAF50',
                    'color': '#fff',
                    'border': 'none',
                    'border-radius': '4px',
                    'cursor': 'pointer',
                    'font-size': '14px',
                    'margin-top': '10px'
                })
                .on('click', function() {
                    var hour = hourInput.val();
                    var minute = minuteInput.val();
                    var time = (hour.length < 2 ? '0' + hour : hour) + ':' + (minute.length < 2 ? '0' + minute : minute);
                    if (settings.type === 12) {
                        time = time + " " + amPmToggle.text();
                        // time = convertTo12HourFormat(time);
                    }
                    timeDisplay.text(time);
                    inputElement.attr('value', time);
                    popup.hide(); // Hide the popup after saving the time
                });

            // Create the popup elements for hour and minute inputs with "OK" button
            var popup = $('<div class="timepicker-popup"></div>')
                .css({
                    'display': 'none',  // Start hidden
                    'position': 'absolute',
                    'top': inputHeight + 8 + 'px', // Position below the input
                    'left': '0',
                    'width': '120px',
                    'padding': '5px',
                    'background-color': '#fff',
                    'border': '1px solid #ccc',
                    'border-radius': '8px',
                    'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.1)',
                    'font-size': '14px',
                    'z-index': '999'
                });

            // Arrange the elements in a row layout for increase hour and increase minute
            popup.append(
                $('<div class="increase-wrapper">')
                    .css({
                        'display': 'flex', 
                        'flex-direction': 'row',  
                        'align-items': 'center',  
                        'gap': '5px'  
                    })
                    .append(increaseHour, increaseMinute)
            );

            // Arrange the elements in a flex layout to position buttons
            popup.append(
                $('<div class="time-wrapper">')
                    .css({
                        'display': 'flex',
                        'align-items': 'center',
                        'gap': '5px'
                    })
                    .append(hourInput, separator, minuteInput, amPmToggle) // Add AM/PM toggle here
            );

            // Row with decrease buttons
            popup.append(
                $('<div class="decrease-wrapper">')
                    .css({
                        'display': 'flex',
                        'flex-direction': 'row',
                        'align-items': 'center',
                        'gap': '5px'
                    })
                    .append(decreaseHour, decreaseMinute)
            );

            // Add the OK button at the bottom
            popup.append(okButton);

            // Show the popup when the timepicker is clicked
            timepicker_content.on('click', function() {
                // Hide any other open popups first
                $('.timepicker-popup').not(popup).hide();
                popup.toggle();  // Toggle visibility of the popup
            });

            // Append the popup below the timepicker
            timepicker_wrapper.append(popup);

            // Replace the input with the timepicker div
            inputElement.css({
                'visibility': 'hidden',
                'display': 'none'
            });
            inputContainer.append(timepicker_wrapper);
        });
    };
})(jQuery);

// Author: Reynaldo S. Batac Jr.  
// Email: reynaldo.batac@icloud.com  
// License: Free to use (with attribution)