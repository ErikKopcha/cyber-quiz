// Domain Entity: User
// Represents authenticated user with progress tracking

export interface UserProps {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly photoURL?: string;
  readonly createdAt: Date;
  readonly level: number;
  readonly xp: number;
}

export class User {
  private constructor(private readonly props: UserProps) {
    this.validate();
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get photoURL(): string | undefined {
    return this.props.photoURL;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get level(): number {
    return this.props.level;
  }

  get xp(): number {
    return this.props.xp;
  }

  // Business Logic: Calculate rank based on XP
  getRank(): string {
    if (this.props.xp < 1000) return 'Cyber-Newbie';
    if (this.props.xp < 2500) return 'Code-Runner';
    if (this.props.xp < 5000) return 'Cyber-Junior';
    if (this.props.xp < 10000) return 'Digital-Samurai';
    if (this.props.xp < 20000) return 'Netrunner';
    if (this.props.xp < 50000) return 'Cyber-Psycho';
    return 'Digital-God';
  }

  // Calculate XP needed for next level
  getXpForNextLevel(): number {
    return this.props.level * 1000;
  }

  // Calculate progress percentage to next level
  getProgressPercentage(): number {
    const xpForCurrentLevel = (this.props.level - 1) * 1000;
    const xpForNextLevel = this.getXpForNextLevel();
    const currentLevelXp = this.props.xp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    return Math.min(100, Math.round((currentLevelXp / xpNeeded) * 100));
  }

  private validate(): void {
    if (!this.props.id || this.props.id.trim() === '') {
      throw new Error('User ID cannot be empty');
    }

    if (!this.props.email || !this.isValidEmail(this.props.email)) {
      throw new Error('Invalid email address');
    }

    if (this.props.level < 1) {
      throw new Error('User level must be at least 1');
    }

    if (this.props.xp < 0) {
      throw new Error('User XP cannot be negative');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toJSON(): UserProps {
    return {
      ...this.props,
      createdAt: this.props.createdAt,
    };
  }
}
