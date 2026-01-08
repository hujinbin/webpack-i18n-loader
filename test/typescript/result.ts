interface User {
  name: string;
  role: string;
  status: string;
}

class UserManager {
  private users: User[] = [];
  
  constructor() {
    this.initializeData();
  }
  
  private initializeData(): void {
    this.users = [
      { name: $t('615db57aa314529a'), role: $t('b1dae9bc5cabbc13'), status: $t('68905cf391b24285') },
      { name: $t('36c942351ec9cc3a'), role: $t('7527da8954f3407b'), status: $t('50d4a8502e0ba541') }
    ];
  }
  
  public addUser(user: User): void {
    this.users.push(user);
    console.log($t('c9f525db41d0fde6'));
  }
  
  public removeUser(name: string): boolean {
    const index = this.users.findIndex(u => u.name === name);
    if (index !== -1) {
      this.users.splice(index, 1);
      console.log($t('9b86e7252f7f80ae'));
      return true;
    }
    console.log($t('489251bfc85d3b13'));
    return false;
  }
  
  public updateUserStatus(name: string, status: string): void {
    const user = this.users.find(u => u.name === name);
    if (user) {
      user.status = status;
      console.log($t("83c16683d756486c",[status]));
    } else {
      throw new Error($t('36e70859fb99c631'));
    }
  }
  
  public getUserInfo(name: string): string {
    const user = this.users.find(u => u.name === name);
    return user ? $t("7df2998956788726",[user.name,$t("1b9fa32649aa7e92"),user.role]) : $t('f5bd977bd591aa47');
  }
}

const errorMessages = {
  required: $t('34a5b2248241bd77'),
  invalid: $t('8f1cc31c1cbccff7'),
  tooShort: $t('acb8fe2bf9722010'),
  tooLong: $t('b8f14e9136e08716')
};

function validateInput(value: string): string {
  if (!value) return errorMessages.required;
  if (value.length < 6) return errorMessages.tooShort;
  if (value.length > 20) return errorMessages.tooLong;
  return $t('d1ca6194a363460b');
}
