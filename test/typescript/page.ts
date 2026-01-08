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
      { name: '张三', role: '管理员', status: '在线' },
      { name: '李四', role: '普通用户', status: '离线' }
    ];
  }
  
  public addUser(user: User): void {
    this.users.push(user);
    console.log('用户添加成功');
  }
  
  public removeUser(name: string): boolean {
    const index = this.users.findIndex(u => u.name === name);
    if (index !== -1) {
      this.users.splice(index, 1);
      console.log('用户删除成功');
      return true;
    }
    console.log('用户不存在');
    return false;
  }
  
  public updateUserStatus(name: string, status: string): void {
    const user = this.users.find(u => u.name === name);
    if (user) {
      user.status = status;
      console.log(`状态已更新为：${status}`);
    } else {
      throw new Error('用户未找到');
    }
  }
  
  public getUserInfo(name: string): string {
    const user = this.users.find(u => u.name === name);
    return user ? `用户：${user.name}，角色：${user.role}` : '未找到用户信息';
  }
}

const errorMessages = {
  required: '此字段为必填项',
  invalid: '输入无效',
  tooShort: '输入太短',
  tooLong: '输入太长'
};

function validateInput(value: string): string {
  if (!value) return errorMessages.required;
  if (value.length < 6) return errorMessages.tooShort;
  if (value.length > 20) return errorMessages.tooLong;
  return '验证通过';
}
