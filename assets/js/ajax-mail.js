$(function() {
    // Helper function to show error
    function showError(field, message) {
        field.addClass('input-error').css('border', '1px solid #dc3545');
        var errorSpan = field.next('.error-text');
        if (errorSpan.length === 0) {
            field.after('<span class="error-text" style="color: #dc3545; font-size: 13px; display: block; margin-top: 5px; font-weight: 500;">' + message + '</span>');
        } else {
            errorSpan.text(message);
        }
    }

    // Helper function to remove error
    function removeError(field) {
        field.removeClass('input-error').css('border', '');
        if (field.next('.error-text').length) {
            field.next('.error-text').remove();
        }
    }

    // Add input event listeners to clear error styling
    $('form').on('input change', 'input, textarea, select', function() {
        var field = $(this);
        removeError(field);
        
        if (field.is(':checkbox')) {
            removeError(field.parent());
        }
        
        // Special handling for nice-select
        if (field.is('select') && field.next('.nice-select').length) {
            removeError(field.next('.nice-select'));
        }
    });

    // Handle every AJAX-submitted form on the site (contact + quote).
    $('#contact-form, #quote-form').each(function() {
        var form = $(this);
        var formMessages = form.find('.form-message');

        form.submit(function(e) {
            e.preventDefault();

            var isValid = true;
            var firstInvalidField = null;

            // Clear previous errors
            form.find('.error-text').remove();
            form.find('.input-error').removeClass('input-error').css('border', '');

            // Validate all required inputs, selects, and textareas
            form.find('input[required], textarea[required], select[required]').each(function() {
                var field = $(this);
                var val = $.trim(field.val());
                
                if (field.is('select')) {
                    // nice-select handling
                    if (!val || val === '' || val === 'Please Select') {
                        isValid = false;
                        var niceSelect = field.next('.nice-select');
                        if (niceSelect.length) {
                            showError(niceSelect, 'Please select an option.');
                            if (!firstInvalidField) firstInvalidField = niceSelect;
                        } else {
                            showError(field, 'Please select an option.');
                            if (!firstInvalidField) firstInvalidField = field;
                        }
                    }
                } else if (field.is(':checkbox')) {
                    if (!field.is(':checked')) {
                        isValid = false;
                        showError(field.parent(), 'You must agree to continue.');
                        if (!firstInvalidField) firstInvalidField = field;
                    }
                } else if (field.is('input[type="email"]')) {
                    var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
                    if (!val || !emailRegex.test(val)) {
                        isValid = false;
                        showError(field, 'Please enter a valid email address.');
                        if (!firstInvalidField) firstInvalidField = field;
                    }
                } else if (field.is('input[type="tel"]') || field.attr('name') === 'phone') {
                    var phoneRegex = /^\+?[0-9\s\-().]{7,25}$/;
                    if (!val || !phoneRegex.test(val)) {
                        isValid = false;
                        showError(field, 'Please enter a valid phone number (at least 7 digits).');
                        if (!firstInvalidField) firstInvalidField = field;
                    }
                } else {
                    if (!this.checkValidity() || val === '') {
                        isValid = false;
                        showError(field, this.validationMessage || 'This field is required.');
                        if (!firstInvalidField) firstInvalidField = field;
                    }
                }
            });

            if (!isValid) {
                formMessages.removeClass('success').addClass('error').text('Please correct the highlighted fields and try again.');
                if (firstInvalidField) {
                    $('html, body').animate({
                        scrollTop: firstInvalidField.offset().top - 120
                    }, 400);
                    firstInvalidField.focus();
                }
                return;
            }

            var submitBtn = form.find('button[type="submit"]');
            var originalBtnText = submitBtn.html();
            submitBtn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Submitting...');

            // Submit the form using AJAX.
            $.ajax({
                type: 'POST',
                url: form.attr('action'),
                data: form.serialize()
            })
            .done(function(response) {
                formMessages.removeClass('error').addClass('success');
                formMessages.text(response || 'Thank You! Your message has been sent.');

                // Clear the form.
                form.find('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea').val('');
                form.find('input[type="checkbox"]').prop('checked', false);
                form.find('select').val('').prop('selectedIndex', 0).trigger('change');
                
                // Reset nice-select text to default placeholder
                form.find('select').each(function() {
                    var s = $(this);
                    if (s.next('.nice-select').length) {
                        s.next('.nice-select').find('.current').text('Please Select');
                        s.next('.nice-select').removeClass('input-error').css('border', '');
                        s.next('.nice-select').next('.error-text').remove();
                    }
                });
            })
            .fail(function(xhr) {
                formMessages.removeClass('success').addClass('error');
                if (xhr.responseText && xhr.responseText.trim() !== '') {
                    formMessages.text(xhr.responseText.trim());
                } else {
                    formMessages.text('Oops! An error occurred and your message could not be sent.');
                }
            })
            .always(function() {
                submitBtn.prop('disabled', false).html(originalBtnText);
            });
        });
    });
});
