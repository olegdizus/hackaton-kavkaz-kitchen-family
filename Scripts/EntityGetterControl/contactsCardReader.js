function ContactCardReader(getContactByKeyUrl, callback) {
    this.readCard = function () {

        initCardConfrim();

        cardConfirm.swichToContactConfirmMode();
        cardConfirm.open();
        
        cardConfirm.setCallback(read);

        cardConfirm.InitContactKeyInput({});
    }

    this.init = function() {
        cardConfirm.InitUnbindCardKeyWaiting();
    }

  function read() {
        if (cardConfirm.getContactKey().length == 0) {
            cardConfirm.Reset();

            return;
        }

      if (getContactByKeyUrl) {
          getContactByKey(cardConfirm.getContactKey());
      } else {
          callback(cardConfirm.getContactKey());
          cardConfirm.close();
      }
  }

    function getContactByKey(contactKey) {
        $.ajax({
            url: getContactByKeyUrl,
            data: { key: contactKey },
            async: false,
            success: function(data) {
                if (data.success == false) {
                    notification.warning(data.messageText);
                } else {
                    callback(data);
                }
                cardConfirm.close();
            }
        });
    }
}