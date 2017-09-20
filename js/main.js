function fillRepositories(cnt, items, append = 0) {
    $('#repoCount').html(cnt);

    $jst = '<span class="badge badge-pill badge-success">JS</span>';
    $phpt = '<span class="badge badge-pill badge-info">PHP</span>';
    $deft = '<span class="badge badge-pill badge-default">other</span>';

    items.forEach(function (item) {
        r = $('<tr>');
        ['full_name'].forEach(function (attr) {
            c = $('<td>');
            r.append(c.html("<a target='_blank' href='https://github.com/" + item[attr] + "'>" + item[attr] + "<a/>"));
        });

        var e;
        var l = item.language || 'not define';

        switch (l.toLowerCase()) {
            case 'php':
                e = $('<td>').html($phpt);
                break;
            case 'javascript':
                e = $('<td>').html($jst);
                break;
            default:
                e = $('<td>').html($deft);
        }

        r.append(e);

        $('#resultsTable').append(r);
    });

    append ? '' : $('#results').toggleClass('d-none');
}

function showAlerts() {
    $('#alert').removeClass('d-none');
}

function hideAlerts() {
    $('#alert').addClass('d-none');
    $('#results').addClass('d-none');

    $('#resultsTable').html('');
}

function loadData(query, lang, append) {
    var url = '/api.php';

    $.ajax({
        method: "POST",
        url: url,
        data: {query: query, lang: lang, p: page},
        datatype: 'json',
        success: function (response) {
            fillRepositories(response.total_count, response.items, append);
        },
        error: function (msg) {
            showAlerts()
        }
    });
}

function maskSend() {
    last_query = $('#mask').val();
    last_lang = [];
    page = 1;

    hideAlerts();

    $('input[id *= "-check"]:checked').each(function (index, el) {
        last_lang.push($(el).attr('data-val'));
    });

    loadData(last_query, last_lang);
}

$(document).ready(function () {

    page = 1;
    last_query = '';
    last_lang = [];

    $('#moreButton').on('click', function (event) {
        page++;
        loadData(last_query, last_lang, 1);
    });

    $('#mask').on("keypress", function (e) {
        if (e.keyCode == 13) {
            maskSend();
        }
    }).focus();

    $('#submitButton').on('click', function (event) {
        maskSend()
    });

});