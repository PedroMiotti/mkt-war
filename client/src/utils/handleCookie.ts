export function getCookie(cookieName: string): string {
  let name = cookieName + "=";
  let cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let temp = cookieArr[i].trim();
    if (temp.indexOf(name) == 0)
      return temp.substring(name.length, temp.length);
  }

  return "";
}

export function deleteCookie(cookieName: string) {
  document.cookie = cookieName + "=; Max-Age=0";
}


