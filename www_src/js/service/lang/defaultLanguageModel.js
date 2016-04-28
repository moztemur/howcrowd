var defaultLanguageModel = function() {
    return {
        "MAIN_MENU": {
            "SEE_CROWD": "See Crowd",
            "SET_CROWD": "Set Crowd",
            "SETTINGS": "Settings",
            "ABOUT": "About",
            "EXIT": "Exit",
            "CLOSE": "Close",
            "LOADING": "Loading..."
        },
        "SEE_CROWD_MENU": {
            "HERE": "Here",
            "ON_MAP": "On Map",
            "IN_CITY": "In City",
            "DATE": "Date",
            "NAME": "Place Name",
            "LAST_VALUE": "Last",
            "AVERAGE_VALUE": "Avg.",
            "MIN_AGO": "min(s) ago",
            "NO_PLACE": "No recent crowd. Tab to enter one!",
            "NO_LOCATION": "No location data. Make sure your device's location service is accessible, then tab to refresh!",
            "SEARCH": "Search"
        },
        "SEE_CROWD_DETAIL_POPOVER_MENU": {
            "INFO": "Info",
            "SHARE": "Share",
            "REPORT": "Report"
        },
        "CROWD_SHARE_MENU": {
            "WHATSAPP": "WhatsApp",
            "MESSAGE": "Message",
            "EMAIL": "E-Mail"
        },
        "CROWD_REPORT_MENU": {
            "REPORT": "Report",
            "INAPPROPRIATE": "Inappropriate",
            "PRIVATE": "Private",
            "MISLEADING": "Misleading"
        },
        "SET_CROWD_MENU": {
            "SELECT_PLACE": "Select Place",
            "ENTER_CUSTOM_PLACE": "Enter Custom Place",
            "PLACE_NAME": "Place Name",
            "NO_PLACE": "No places around. Tab to enter a custom place!",
            "NO_LOCATION": "No location data. Make sure your device's location service is accessible, then tab to refresh!",
            "PULL_TO_REFRESH": "Pull down to refresh",
            "RELEASE_TO_REFRESH": "Release to refresh"
        },
        "CROWD_VALUES" : {
          "100" : "100",
          "90": "90",
          "80": "80",
          "70": "70",
          "60": "60",
          "50": "50",
          "40": "40",
          "30": "30",
          "20": "20",
          "10": "10",
          "0": "0"
        },
        "ABOUT": {
            "DESCRIPTION": "Crowd (Kalabalık), etrafınızdaki yerlerin yoğunluk bilgilerini başkalarıyla kimliğinizi belirtmeden paylaşabileceğiniz, başkalarının paylaştığı yoğunluk bilgilerini de anlık takip edebileceğiniz interaktif bir uygulamadır.Uygulamayı daha etkin kullanabilmek için aygıtınızın konum bilgisinin açık olması gerekmektedir.",
            "SEE_CROWD": {
                "TITLE": "Kalabalık Gör",
                "DESCRIPTION": "Uygulamanın ana modüllerinden biri kalabalık bilgilerini görebileceğiniz kısımdır. Bu modülde kalabalık bilgileri hakkında detayları, geri bildirimleri görebilir ve paylaşabilirsiniz. Özel olarak girilen yoğunluk bilgilerinden uygulama kriterlerine uygun olmayanlarını bildirebilirsiniz.",
                "IN_CITY": {
                    "TITLE": "Şehirde",
                    "DESCRIPTION": "Şehirde konum bilgilerini görmek demek, 15 km uzağınızdaki son 1 saatte girilen yoğunluk bilgilerini görmek demektir. (İleriki aşamada yer ve zaman ayarlanabilir olacaktır.)"
                },
                "HERE": {
                    "TITLE": "Burada",
                    "DESCRIPTION": "Bu seçenek sayesinde hemen yakınınızdaki kalabalık bilgilerini görebilirsiniz. Girilen bilgilerin yararlılığını geri bildirimler vererek diğer kullanıcılarla paylaşabilirsiniz."
                },
                "ON_MAP": {
                    "TITLE": "Haritada",
                    "DESCRIPTION": "Şehirdeki kalabalık bilgilerini haritada üzerinde görebilirsiniz."
                }
            },
            "SET_CROWD": {
                "TITLE": "Kalabalık Gir",
                "DESCRIPTION": "Uygulamanın ana modüllerinden biri kalabalık bilgilerini başkalarıyla paylaşabileceğiniz kısımdır. Yakınınızda, Google Maps'in sağladığı ya da diğer kullanıcıların paylaştığı yerlerden istediğiniz için bir yoğunluk değeri girebilirsiniz."
            }
        },
        "SETTINGS": {
            "CONTENT_SETTINGS": "Content Settings",
            "DISPLAY_CUSTOM_PLACES": "Display custom places"
        },
        "CONFIRM": {
            "CONFIRM": "Confirm",
            "QUIT_CONFIRM": "Are you sure you want to quit?",
            "OK": "Ok",
            "CANCEL": "Cancel"
        },
        "ALERT": {
            "ALERT": "Alert",
            "SUCCESS": "Successful!",
            "FAIL": "Failure!",
            "OK": "Ok"
        },
        "ERROR": {

        }
    }
};
angular.module('lang', [])
    .factory('defaultLanguageModel', [defaultLanguageModel]);