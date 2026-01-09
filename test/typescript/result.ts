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
      { name: $t('a314529aaa0fbe95'), role: $t('5cabbc13e4bee21a'), status: $t('91b2428572e64460') },
      { name: $t('1ec9cc3ad124e288'), role: $t('54f3407b379efe25'), status: $t('2e0ba5411582c33e') }
    ];
  }
  
  public addUser(user: User): void {
    this.users.push(user);
    console.log($t('41d0fde6d41c119b'));
  }
  
  public removeUser(name: string): boolean {
    const index = this.users.findIndex(u => u.name === name);
    if (index !== -1) {
      this.users.splice(index, 1);
      console.log($t('2f7f80aee02698c9'));
      return true;
    }
    console.log($t('c85d3b139b576164'));
    return false;
  }
  
  public updateUserStatus(name: string, status: string): void {
    const user = this.users.find(u => u.name === name);
    if (user) {
      user.status = status;
      console.log($t("28683123c0a39867",[status]));
    } else {
      throw new Error($t('fb99c6315c88a17a'));
    }
  }
  
  public getUserInfo(name: string): string {
    const user = this.users.find(u => u.name === name);
    return user ? $t("552a79aee195ebc8",[user.name,user.role]) : $t('d591aa4751673b09');
  }
}

const errorMessages = {
  required: $t('8241bd77b682a220'),
  invalid: $t('1cbccff72cd2f874'),
  tooShort: $t('f9722010bf4b69ea'),
  tooLong: $t('36e08716543beeed')
};

function validateInput(value: string): string {
  if (!value) return errorMessages.required;
  if (value.length < 6) return errorMessages.tooShort;
  if (value.length > 20) return errorMessages.tooLong;
  return $t('a363460b89b13570');
}
