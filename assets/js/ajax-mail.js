$(function () {
    // Initialize intlTelInput on tel inputs
    if (window.intlTelInput) {
        $('input[type="tel"]').each(function() {
            var iti = window.intlTelInput(this, {
                initialCountry: "ae",
                preferredCountries: ["ae", "in", "sa", "om", "qa", "kw", "sg", "us", "gb"],
                separateDialCode: true,
                utilsScript: "assets/vendor/intl-tel-input/js/utils.js"
            });
            $(this).data('iti', iti);
        });
    }

    $('#contact-form, #quote-form').each(function () {
        var form = $(this), status = form.find('.form-message'), pending = false;
        // Keep native dropdowns keyboard and mobile accessible.
        form.find('select').each(function () {
            if ($(this).next('.nice-select').length) $(this).niceSelect('destroy');
            $(this).css({ display: 'block', width: '100%', minHeight: '54px' });
        });
        form.prop('noValidate', true);
        function clear(field) {
            field.removeClass('input-error').removeAttr('aria-invalid aria-describedby').css('border', '');
            field.closest('.iti').removeClass('input-error');
            form.find('#error-' + form.attr('id') + '-' + field.attr('name')).remove();
        }
        form.on('countrychange input change', 'input, textarea, select', function () { clear($(this)); });
        form.on('submit', function (event) {
            event.preventDefault();
            if (pending) return;
            var first = null;
            status.removeClass('success error').text('');
            form.find('input, textarea, select').not('[name="website"]').each(function () {
                var field = $(this), value = $.trim(field.val()), error = '';
                var iti = field.data('iti');
                clear(field);
                
                if (this.type !== 'checkbox') field.val(value);
                
                if (this.required && (this.type === 'checkbox' ? !this.checked : !value)) {
                    error = this.type === 'checkbox' ? 'Please agree to continue.' : 'This field is required.';
                } else if (value) {
                    if (iti) {
                        var digits = value.replace(/\D/g, '');
                        if (digits.length < 7 || digits.length > 15) {
                            error = 'Please enter a valid phone number with 7–15 digits.';
                        } else {
                            var formatted = '';
                            try {
                                formatted = iti.getNumber();
                            } catch (e) {}
                            if (!formatted || !formatted.startsWith('+')) {
                                var countryData = iti.getSelectedCountryData();
                                var dialCode = countryData && countryData.dialCode ? ('+' + countryData.dialCode) : '';
                                var cleanVal = value.replace(/^\+/, '').trim();
                                if (dialCode && !cleanVal.startsWith(countryData.dialCode)) {
                                    formatted = dialCode + ' ' + cleanVal;
                                } else {
                                    formatted = '+' + cleanVal;
                                }
                            }
                            field.val(formatted);
                        }
                    } else if (this.name === 'name' && !/^[\p{L}\p{M} .’'\-]{2,80}$/u.test(value)) {
                        error = 'Enter a name of 2–80 characters using letters and basic punctuation.';
                    } else if (this.type === 'tel' && (!/^\+?[0-9 () .\-]{7,25}$/.test(value) || value.replace(/\D/g, '').length < 7 || value.replace(/\D/g, '').length > 15)) {
                        error = 'Enter a phone number with 7–15 digits.';
                    } else if (this.minLength > 0 && value.length < this.minLength) {
                        error = 'Please enter at least ' + this.minLength + ' characters.';
                    } else if (this.maxLength > 0 && value.length > this.maxLength) {
                        error = 'Please enter no more than ' + this.maxLength + ' characters.';
                    } else if (!this.checkValidity()) {
                        error = this.validationMessage;
                    }
                }
                
                if (error) {
                    var id = 'error-' + form.attr('id') + '-' + this.name;
                    field.addClass('input-error').attr({ 'aria-invalid': 'true', 'aria-describedby': id }).css('border', '1px solid #dc3545');
                    $('<span>').attr('id', id).addClass('error-text').css({ color: '#b42318', display: 'block', fontSize: '13px', marginTop: '5px' }).text(error).insertAfter(field.parent('.iti').length ? field.parent('.iti') : field);
                    if (!first) first = this;
                }
            });
            
            if (first) {
                status.addClass('error').text('Please correct the highlighted fields and try again.');
                first.focus();
                return;
            }
            
            pending = true;
            var button = form.find('button[type="submit"]'), original = button.html();
            button.prop('disabled', true).text('Submitting…');
            form.attr('aria-busy', 'true');
            
            $.ajax({ type: 'POST', url: form.attr('action'), data: form.serialize(), timeout: 45000, dataType: 'text' })
                .done(function (response) {
                    if (!/^Thank You!/.test(response.trim())) {
                        status.addClass('error').text('We could not confirm delivery. Please contact info@oceanuscontainer.com.');
                        return;
                    }
                    status.addClass('success').text(response);
                    form[0].reset();
                    
                    // Reset intlTelInput to default country and clear input
                    form.find('input[type="tel"]').each(function() {
                        var iti = $(this).data('iti');
                        if (iti) {
                            iti.setCountry("ae");
                            $(this).val('');
                        }
                    });
                })
                .fail(function (xhr, reason) {
                    var message = 'Your message could not be sent. Please try again or email info@oceanuscontainer.com.';
                    if (reason === 'timeout') message = 'Delivery could not be confirmed. Please email info@oceanuscontainer.com before retrying.';
                    else if ((xhr.status === 400 || xhr.status === 429) && xhr.responseText && !/[<>]/.test(xhr.responseText)) message = xhr.responseText;
                    status.addClass('error').text(message);
                })
                .always(function () {
                    pending = false;
                    form.removeAttr('aria-busy');
                    button.prop('disabled', false).html(original);
                });
        });
    });
});
