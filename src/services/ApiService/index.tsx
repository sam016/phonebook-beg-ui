import { PhoneEntry } from "../../models";

export function getPhoneNumbers(): Promise<Array<PhoneEntry>> {
  return fetch("http://www.mocky.io/v2/581335f71000004204abaf83")
    .then((res: Response) => {
      return res.json();
    }).then((res: any) => {
      return (res.contacts as Array<any>).map(ob => {
        return {
          name: ob.name,
          phoneNumber: ob.phone_number,
          address: ob.address,
        };
      });
    })
    .catch((res: any) => {
      console.log("res-err:", res);
      return [];
    })
}
