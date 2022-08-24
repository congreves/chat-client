import { atom } from "recoil";

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const userState = atom({
  key: "user",
  default: "",
});

export const idState = atom({
  key: "id",
  default: "",
});

export const roomState = atom({
  key: "room",
  default: "",
});
