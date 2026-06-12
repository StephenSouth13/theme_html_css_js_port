/* ============================================================
   SFORM COMPONENT — Tích hợp vào Portfolio
   ============================================================ */

function SformComponent() {
    var me = this;
    var sformMap = {};

    this.showSform = function($sformContainer) {
        let code = $sformContainer.data('code');
        if (!code) return;
        $.ajax({
            url: '/api/v0/sform/'+code+'/get-sform',
            type: "GET",
            contentType: "application/json",
            success: function (sformDTO) {
                if (sformDTO && sformDTO.sformid != null) {
                    sformMap[''+sformDTO.sformid] = sformDTO;
                    me.renderLayout(sformDTO, $sformContainer);
                }
            }
        });
    };

    this.renderLayout = function (sformDTO, $sformContainer){
        $sformContainer.empty();
        $sformContainer.attr('sformid', sformDTO.sformid);
        var $sformContent = $('<div class="sform-content-display"></div>');
        $sformContainer.append($sformContent);
        $sformContent.append(sformDTO.content);

        // Khởi tạo datepicker nếu có
        if ($sformContent.find('.datepicker').length > 0 && $.fn.flatpickr) {
            $sformContent.find('.datepicker').flatpickr({ enableTime: true, dateFormat: "d/m/Y H:i" });
        }

        // Nút submit
        if ($sformContent.find('.btn-submit-sform').length == 0) {
            $sformContent.append('<button type="button" class="btn-submit-sform">Submit</button>');
        }

        $sformContent.find('.btn-submit-sform').on('click', function(){
            var $theContainer = $(this).closest('.sform-container');
            var theSform = sformMap[''+$theContainer.attr('sformid')];
            submitSform($theContainer, theSform);
        });
    };

    function submitSform($sformContainer, sformDTO) {
        var sformData = me.getSformData($sformContainer, sformDTO);
        if (sformData != null) {
            sformData.passageResult = { 'servicenumber': window.location.pathname };
            $.ajax({
                url: '/api/v0/sform/save-sform-data',
                type: "POST",
                data: JSON.stringify(sformData),
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    showSaveSformResult($sformContainer, result);
                }
            });
        }
    }

    function showSaveSformResult($sformContainer, result) {
        if (result.errorCode == null) {
            $sformContainer.find('.sform-content-display').html('<div class="success-msg">Thank you for your request. We\'ll contact you soon!</div>');
        } else {
            console.error('Sform submission error:', result);
        }
    }

    this.getSformData = function($container, sform) {
        var sformData = { sformid: sform.sformid, code: sform.code, name: sform.name, data: [] };
        // Tái tạo logic lấy data từ các input tại đây theo cấu trúc form ông đã thiết kế
        return sformData;
    };
}

// Khởi tạo và chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    window.SFORM_COMPONENT = new SformComponent();
    
    // Tự động render các form nếu có class .sform-container
    document.querySelectorAll('.sform-container').forEach(el => {
        window.SFORM_COMPONENT.showSform($(el));
    });
});