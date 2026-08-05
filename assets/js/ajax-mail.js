 $(function() {

    // Handle every AJAX-submitted form on the site (contact + quote).
    $('#contact-form, #quote-form').each(function() {

        var form = $(this);

        // Each form carries its own message container.
        var formMessages = form.find('.form-message');

        form.submit(function(e) {
            // Stop the browser from submitting the form.
            e.preventDefault();

            // Let the browser run its own required-field validation first.
            if (this.checkValidity && !this.checkValidity()) {
                this.reportValidity();
                return;
            }

            var submitBtn = form.find('button[type="submit"]');
            submitBtn.prop('disabled', true);

            // Submit the form using AJAX.
            $.ajax({
                type: 'POST',
                url: form.attr('action'),
                data: form.serialize()
            })
            .done(function(response) {
                formMessages.removeClass('error').addClass('success');
                formMessages.text(response);

                // Clear the form.
                form.find('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea').val('');
                form.find('select').prop('selectedIndex', 0).trigger('change');
            })
            .fail(function(data) {
                formMessages.removeClass('success').addClass('error');

                if (data.responseText !== '') {
                    formMessages.text(data.responseText);
                } else {
                    formMessages.text('Oops! An error occurred and your message could not be sent.');
                }
            })
            .always(function() {
                submitBtn.prop('disabled', false);
            });
        });
    });

});
