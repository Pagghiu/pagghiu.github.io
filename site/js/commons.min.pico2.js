"use strict";
!function () {
    var e = {
        _scheme: "auto",
        buttonsTarget: ".theme-switcher",
        iconTarget: ".icon-theme-toggle",
        localStorageKey: "picoPreferredColorScheme",
        init() {
            this.scheme = this.schemeFromLocalStorage,
                this.initSwitchers()
        },
        get schemeFromLocalStorage() {
            return void 0 !== window.localStorage && null !== window.localStorage.getItem(this.localStorageKey) ? window.localStorage.getItem(this.localStorageKey) : this._scheme
        },
        get preferredColorScheme() {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        },
        initSwitchers() {
            document.querySelectorAll(this.buttonsTarget).forEach(e => {
                e.addEventListener("click", e  => {
                    "dark" == this.scheme ? this.scheme = "light" : this.scheme = "dark";
                    e.preventDefault();
                }, !1)
            })
        },
        set scheme(e) {
            "auto" == e ? "dark" == this.preferredColorScheme ? this._scheme = "dark" : this._scheme = "light" : "dark" != e && "light" != e || (this._scheme = e),
                this.applyScheme(),
                this.schemeToLocalStorage()
        },
        get scheme() {
            return this._scheme
        },
        applyScheme() {
            document.querySelector("html").setAttribute("data-theme", this.scheme),
                document.querySelectorAll(this.iconTarget).forEach(e => { 
                    if(this.scheme == "dark")
                        e.classList.add("moon");
                    else
                        e.classList.remove("moon");
                })
        },
        schemeToLocalStorage() {
            void 0 !== window.localStorage && window.localStorage.setItem(this.localStorageKey, this.scheme)
        }
    };
    e.init();
}();
