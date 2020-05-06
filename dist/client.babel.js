"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//
// DOM READY SCRIPT
//
var domIsReady = function (domIsReady) {
  var isBrowserIeOrNot = function isBrowserIeOrNot() {
    return !document.attachEvent || typeof document.attachEvent === "undefined" ? "not-ie" : "ie";
  };

  domIsReady = function domIsReady(callback) {
    if (callback && typeof callback === "function") {
      if (isBrowserIeOrNot() !== "ie") {
        document.addEventListener("DOMContentLoaded", function () {
          return callback();
        });
      } else {
        document.attachEvent("onreadystatechange", function () {
          if (document.readyState === "complete") {
            return callback();
          }
        });
      }
    } else {
      console.error("The callback is not a function!");
    }
  };

  return domIsReady;
}(domIsReady || {}); //
// DOM IS READY
//


(function (document, window, domIsReady, undefined) {
  domIsReady(function () {
    function tumbiliSubmitForm(evt) {
      var form = evt.target;
      var loader = form.querySelector(".tumbili-loader");
      var data = {};
      data.fname = form.querySelector(".tumbiliFName") ? form.querySelector(".tumbiliFName").value : "";
      data.lname = form.querySelector(".tumbiliLName") ? form.querySelector(".tumbiliLName").value : "";
      data.email = form.querySelector(".tumbiliEmail") ? form.querySelector(".tumbiliEmail").value : "";
      var fields = form.querySelectorAll(".tumbili-custom-field") ? form.querySelectorAll(".tumbili-custom-field") : [];
      data.fields = _toConsumableArray(fields).map(function (field) {
        var type = field.dataset.type;
        var value = type === "select" ? field.options[field.selectedIndex].text : field.value;
        return {
          mergeField: field.name,
          value: value,
          type: type
        };
      });
      data.apikey = form.dataset.apikey;
      data.listID = form.dataset.listid;
      data.dc = form.dataset.apikey.split("-")[1];
      sendRequestViaAJAX(data, form, loader);
    }

    function sendRequestViaAJAX(formData, form, loader) {
      var fields = "";

      if (formData.fields) {
        formData.fields.map(function (field) {
          if (field.value) {
            fields += "&formCustomFields[".concat(field.mergeField, "]=").concat(field.value);
          }
        });
      }

      var data = "action=tumbili_mailchimp_add_subscriber&formData[apikey]=".concat(formData.apikey, "&formData[listID]=").concat(formData.listID, "&formData[dc]=").concat(formData.dc, "&formData[fname]=").concat(formData.fname, "&formData[lname]=").concat(formData.lname, "&formData[email]=").concat(formData.email).concat(fields);
      var serializedData = encodeURI(data);
      var xhr = new XMLHttpRequest();
      var url = tumbili.ajax_url;
      form.classList.toggle("isSubmitting");
      loader.classList.toggle("is-hiding");
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.responseType = "json";

      xhr.onerror = function () {
        console.log("Error: Do something else...");
      };

      xhr.onprogress = function () {
        console.log("status:LOADING", xhr.status, " STATE", xhr.readyState, " RESPONSE", JSON.parse(xhr.response));
      };

      xhr.onload = function (response) {
        if (xhr.status == 200) {
          form.classList.toggle("isSubmitting");
          loader.classList.toggle("is-hiding");
          console.log("status:DONE", xhr.status, " STATE", xhr.readyState, "NoParseResponse", xhr.response); // JSON response

          var mailchimpResponse = xhr.response;
          showApiResult(mailchimpResponse, form);
        }
      };

      xhr.send(serializedData);
    }

    function showApiResult(response, form) {
      var title = "";

      if (response.status === 400) {
        switch (response.title) {
          case "Forgotten Email Not Subscribed":
            title = "Looks like you unsubscribed from this list previously, please contact us to resubscribe";
            break;

          case "Member Exists":
            title = "😄 Looks you are already subscribed";
            break;

          default:
            title = "Oops something wen't wrong: ".concat(response.title);
        }
      } else {
        title = "🎉 You have subscribed. Please check your inbox for confirmation.";
      }

      toggleForm(title, form);
    }

    function toggleForm(title, form) {
      var formContainer = form.querySelector(".tumbili-container");
      var responseContainer = form.querySelector(".tumbili-response");
      formContainer.classList.toggle("is-hiding");
      responseContainer.classList.toggle("is-hiding");
      responseContainer.innerHTML = title;
    }

    var formTumbili = document.querySelectorAll(".tumbili-form");

    for (var i = 0; i < formTumbili.length; i++) {
      formTumbili[i].addEventListener("submit", function (evt) {
        evt.preventDefault();
        tumbiliSubmitForm(evt);
      });
    }

    if (document.querySelector(".tumbili-response")) {
      document.querySelector(".tumbili-response").onclick = function (evt) {
        var target = evt.target;
        var form = target.closest("form");
        toggleForm("", form);
      };
    }
  });
})(document, window, domIsReady);