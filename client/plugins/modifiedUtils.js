const SocialProfileUrlParser = require('@salesflare/social-profile-url-parser')

if (String) {
  // eslint-disable-next-line no-extend-native
  String.prototype.isEmpty = String.prototype.isEmpty || function () {
    return !(this.trim().length)
  }
  // eslint-disable-next-line no-extend-native
  String.prototype.replaceAll = function (search, replacement) {
    var target = this
    return target.replace(new RegExp(search, 'g'), replacement)
  }
  // eslint-disable-next-line no-extend-native
  String.prototype.parseSocial = function () {
    return SocialProfileUrlParser.parse(this)
  }
}
