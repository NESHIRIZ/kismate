import fs from "fs";
import path from "node:path";
import {
  type BlockRecord,
  type ConversationRecord,
  type DatingPreferencesRecord,
  type LikeRecord,
  type LifestyleRecord,
  type MatchRecord,
  type MessageRecord,
  type PassRecord,
  type ProfilePhotoRecord,
  type ProfileRecord,
  type UserInterestRecord,
  type UserRecord,
  type UserStatus,
} from "@/lib/kismate";
import { hashPassword } from "@/lib/auth";

export type OrganizerCardRecord = {
  id: number;
  headline: string;
  body: string;
  example: string | null;
  sort_order: number;
  is_published: number;
  updated_at: string;
};

export type EventRecord = {
  id: number;
  name: string;
  date: string;
  location: string | null;
  description: string | null;
  organizer_id: number;
  created_at: string;
};

export type GuestRecord = {
  id: number;
  event_id: number;
  name: string;
  email: string;
  rsvp_status: string;
  created_at: string;
};

class SimpleDB {
  private data: {
    users: UserRecord[];
    profiles: ProfileRecord[];
    profilePhotos: ProfilePhotoRecord[];
    userInterests: UserInterestRecord[];
    lifestyles: LifestyleRecord[];
    preferences: DatingPreferencesRecord[];
    likes: LikeRecord[];
    passes: PassRecord[];
    matches: MatchRecord[];
    conversations: ConversationRecord[];
    messages: MessageRecord[];
    blocks: BlockRecord[];
    organizer_cards: OrganizerCardRecord[];
    events: EventRecord[];
    guests: GuestRecord[];
  } = {
    users: [],
    profiles: [],
    profilePhotos: [],
    userInterests: [],
    lifestyles: [],
    preferences: [],
    likes: [],
    passes: [],
    matches: [],
    conversations: [],
    messages: [],
    blocks: [],
    organizer_cards: [],
    events: [],
    guests: [],
  };

  private nextId = {
    users: 1,
    profiles: 1,
    profilePhotos: 1,
    userInterests: 1,
    lifestyles: 1,
    preferences: 1,
    likes: 1,
    passes: 1,
    matches: 1,
    conversations: 1,
    messages: 1,
    blocks: 1,
    organizer_cards: 1,
    events: 1,
    guests: 1,
  };

  constructor() {
    this.loadFromFile();
  }

  private getFilePath(): string {
    const dbPath = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), "kismate.json");
    return dbPath;
  }

  private loadFromFile() {
    try {
      const filePath = this.getFilePath();
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const loaded = JSON.parse(content) as Partial<typeof this.data>;

        this.data = {
          users: Array.isArray(loaded.users) ? (loaded.users as UserRecord[]) : [],
          profiles: Array.isArray(loaded.profiles) ? (loaded.profiles as ProfileRecord[]) : [],
          profilePhotos: Array.isArray(loaded.profilePhotos) ? (loaded.profilePhotos as ProfilePhotoRecord[]) : [],
          userInterests: Array.isArray(loaded.userInterests) ? (loaded.userInterests as UserInterestRecord[]) : [],
          lifestyles: Array.isArray(loaded.lifestyles) ? (loaded.lifestyles as LifestyleRecord[]) : [],
          preferences: Array.isArray(loaded.preferences) ? (loaded.preferences as DatingPreferencesRecord[]) : [],
          likes: Array.isArray(loaded.likes) ? (loaded.likes as LikeRecord[]) : [],
          passes: Array.isArray(loaded.passes) ? (loaded.passes as PassRecord[]) : [],
          matches: Array.isArray(loaded.matches) ? (loaded.matches as MatchRecord[]) : [],
          conversations: Array.isArray(loaded.conversations) ? (loaded.conversations as ConversationRecord[]) : [],
          messages: Array.isArray(loaded.messages) ? (loaded.messages as MessageRecord[]) : [],
          blocks: Array.isArray(loaded.blocks) ? (loaded.blocks as BlockRecord[]) : [],
          organizer_cards: Array.isArray(loaded.organizer_cards) ? (loaded.organizer_cards as OrganizerCardRecord[]) : [],
          events: Array.isArray(loaded.events) ? (loaded.events as EventRecord[]) : [],
          guests: Array.isArray(loaded.guests) ? (loaded.guests as GuestRecord[]) : [],
        };
      }

      this.nextId.users = Math.max(1, ...this.data.users.map((user) => user.id), 0) + 1;
      this.nextId.profiles = Math.max(1, ...this.data.profiles.map((profile) => profile.id), 0) + 1;
      this.nextId.profilePhotos = Math.max(1, ...this.data.profilePhotos.map((photo) => photo.id), 0) + 1;
      this.nextId.userInterests = Math.max(1, ...this.data.userInterests.map((interest) => interest.id), 0) + 1;
      this.nextId.lifestyles = Math.max(1, ...this.data.lifestyles.map((style) => style.id), 0) + 1;
      this.nextId.preferences = Math.max(1, ...this.data.preferences.map((preference) => preference.id), 0) + 1;
      this.nextId.likes = Math.max(1, ...this.data.likes.map((interaction) => interaction.id), 0) + 1;
      this.nextId.passes = Math.max(1, ...this.data.passes.map((interaction) => interaction.id), 0) + 1;
      this.nextId.matches = Math.max(1, ...this.data.matches.map((match) => match.id), 0) + 1;
      this.nextId.conversations = Math.max(1, ...this.data.conversations.map((conversation) => conversation.id), 0) + 1;
      this.nextId.messages = Math.max(1, ...this.data.messages.map((message) => message.id), 0) + 1;
      this.nextId.blocks = Math.max(1, ...this.data.blocks.map((block) => block.id), 0) + 1;
      this.nextId.organizer_cards = Math.max(1, ...this.data.organizer_cards.map((card) => card.id), 0) + 1;
      this.nextId.events = Math.max(1, ...this.data.events.map((event) => event.id), 0) + 1;
      this.nextId.guests = Math.max(1, ...this.data.guests.map((guest) => guest.id), 0) + 1;

      if (this.data.users.length === 0) {
        this.seedDemoData();
      }
    } catch (error) {
      console.warn("Failed to load database from file:", error);
    }
  }

  private seedDemoData() {
    const now = new Date().toISOString();
    const demoUsers = [
      { id: 1, name: "Amara Ndlovu", email: "amara@example.com", passwordHash: hashPassword("password123"), dateOfBirth: "1994-04-15", status: "active" as const },
      { id: 2, name: "Leo Martins", email: "leo@example.com", passwordHash: hashPassword("password123"), dateOfBirth: "1991-08-21", status: "active" as const },
      { id: 3, name: "Zuri Okafor", email: "zuri@example.com", passwordHash: hashPassword("password123"), dateOfBirth: "1997-02-03", status: "active" as const },
      { id: 4, name: "Noah Patel", email: "noah@example.com", passwordHash: hashPassword("password123"), dateOfBirth: "1992-09-18", status: "active" as const },
      { id: 5, name: "Ivy Thompson", email: "ivy@example.com", passwordHash: hashPassword("password123"), dateOfBirth: "1990-11-07", status: "active" as const },
    ];

    this.data.users = demoUsers.map((user) => ({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
      emailVerified: true,
      profileCompleted: true,
      onboardingCompleted: true,
      status: user.status,
      dateOfBirth: user.dateOfBirth,
    }));

    const demoProfiles = [
      { userId: 1, firstName: "Amara", displayName: "Amara", dateOfBirth: "1994-04-15", gender: "woman" as const, city: "Bulawayo", country: "Zimbabwe", region: "Matabeleland", headline: "Intentional, warm, and curious.", bio: "I love meaningful conversations, slow weekends, and building a life with someone who values growth and genuine chemistry.", relationshipIntent: "long-term-relationship" as const, profilePhoto: "/images/profiles/amara.jpg" },
      { userId: 2, firstName: "Leo", displayName: "Leo", dateOfBirth: "1991-08-21", gender: "man" as const, city: "Harare", country: "Zimbabwe", region: "Mashonaland", headline: "Traveler with a grounded heart.", bio: "I enjoy live music, coffee walks, and building a relationship around trust, laughter, and shared goals.", relationshipIntent: "serious-dating" as const, profilePhoto: "/images/profiles/leo.jpg" },
      { userId: 3, firstName: "Zuri", displayName: "Zuri", dateOfBirth: "1997-02-03", gender: "woman" as const, city: "Gweru", country: "Zimbabwe", region: "Midlands", headline: "Creativity, kindness, and great energy.", bio: "I value deep conversations, exploring the city, and finding a partner who is emotionally available and fully present.", relationshipIntent: "serious-dating" as const, profilePhoto: "/images/profiles/zuri.jpg" },
      { userId: 4, firstName: "Noah", displayName: "Noah", dateOfBirth: "1992-09-18", gender: "man" as const, city: "Mutare", country: "Zimbabwe", region: "Manicaland", headline: "Thoughtful, ambitious, and easy to be around.", bio: "I enjoy thoughtful planning, slow travel, and building a life with someone who shares both curiosity and calm.", relationshipIntent: "marriage" as const, profilePhoto: "/images/profiles/noah.jpg" },
      { userId: 5, firstName: "Ivy", displayName: "Ivy", dateOfBirth: "1990-11-07", gender: "woman" as const, city: "Victoria Falls", country: "Zimbabwe", region: "Matabeleland North", headline: "Warm soul with a playful streak.", bio: "I like meaningful rituals, great food, and meeting people who are comfortable being honest and fully themselves.", relationshipIntent: "long-term-relationship" as const, profilePhoto: "/images/profiles/ivy.jpg" },
    ];

    this.data.profiles = demoProfiles.map((profile, index) => ({
      id: index + 1,
      userId: profile.userId,
      firstName: profile.firstName,
      displayName: profile.displayName,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      city: profile.city,
      region: profile.region,
      country: profile.country,
      bio: profile.bio,
      headline: profile.headline,
      relationshipIntent: profile.relationshipIntent,
      profilePhoto: profile.profilePhoto,
      createdAt: now,
      updatedAt: now,
    }));

    this.data.userInterests = [
      { id: 1, userId: 1, interestId: "music", createdAt: now },
      { id: 2, userId: 1, interestId: "travel", createdAt: now },
      { id: 3, userId: 1, interestId: "food", createdAt: now },
      { id: 4, userId: 2, interestId: "technology", createdAt: now },
      { id: 5, userId: 2, interestId: "travel", createdAt: now },
      { id: 6, userId: 2, interestId: "fitness", createdAt: now },
      { id: 7, userId: 3, interestId: "art", createdAt: now },
      { id: 8, userId: 3, interestId: "music", createdAt: now },
      { id: 9, userId: 3, interestId: "photography", createdAt: now },
      { id: 10, userId: 4, interestId: "reading", createdAt: now },
      { id: 11, userId: 4, interestId: "travel", createdAt: now },
      { id: 12, userId: 4, interestId: "food", createdAt: now },
      { id: 13, userId: 5, interestId: "music", createdAt: now },
      { id: 14, userId: 5, interestId: "nature", createdAt: now },
      { id: 15, userId: 5, interestId: "volunteering", createdAt: now },
    ];

    this.data.lifestyles = demoProfiles.map((profile, index) => ({
      id: index + 1,
      userId: profile.userId,
      education: "University",
      occupation: "Creative professional",
      smoking: "never",
      drinking: "socially",
      exercise: "often",
      children: "no",
      wantsChildren: "yes",
      pets: "cat",
      languages: ["English", "Shona"],
      createdAt: now,
      updatedAt: now,
    }));

    this.data.preferences = [
      { id: 1, userId: 1, ageMin: 25, ageMax: 38, preferredGender: ["man", "woman"], preferredLocation: "Zimbabwe", maxDistanceKm: 300, relationshipIntent: ["serious-dating", "long-term-relationship"], interests: ["travel", "music", "food"], createdAt: now, updatedAt: now },
      { id: 2, userId: 2, ageMin: 25, ageMax: 40, preferredGender: ["woman"], preferredLocation: "Zimbabwe", maxDistanceKm: 250, relationshipIntent: ["serious-dating", "long-term-relationship"], interests: ["music", "travel", "technology"], createdAt: now, updatedAt: now },
      { id: 3, userId: 3, ageMin: 27, ageMax: 38, preferredGender: ["man"], preferredLocation: "Zimbabwe", maxDistanceKm: 200, relationshipIntent: ["serious-dating", "marriage"], interests: ["art", "music", "travel"], createdAt: now, updatedAt: now },
      { id: 4, userId: 4, ageMin: 26, ageMax: 42, preferredGender: ["woman"], preferredLocation: "Zimbabwe", maxDistanceKm: 300, relationshipIntent: ["serious-dating", "long-term-relationship", "marriage"], interests: ["travel", "food", "reading"], createdAt: now, updatedAt: now },
      { id: 5, userId: 5, ageMin: 24, ageMax: 40, preferredGender: ["man"], preferredLocation: "Zimbabwe", maxDistanceKm: 250, relationshipIntent: ["long-term-relationship", "serious-dating"], interests: ["music", "nature", "volunteering"], createdAt: now, updatedAt: now },
    ];

    this.data.profilePhotos = demoProfiles.map((profile, index) => ({
      id: index + 1,
      userId: profile.userId,
      url: profile.profilePhoto,
      isPrimary: true,
      sortOrder: 0,
      createdAt: now,
    }));

    this.nextId.users = 6;
    this.nextId.profiles = demoProfiles.length + 1;
    this.nextId.profilePhotos = this.data.profilePhotos.length + 1;
    this.nextId.userInterests = this.data.userInterests.length + 1;
    this.nextId.lifestyles = this.data.lifestyles.length + 1;
    this.nextId.preferences = this.data.preferences.length + 1;
    this.nextId.likes = 1;
    this.nextId.passes = 1;
    this.nextId.matches = 1;
    this.nextId.blocks = 1;
    this.saveToFile();
  }

  private saveToFile() {
    try {
      const filePath = this.getFilePath();
      fs.writeFileSync(filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.warn("Failed to save database to file:", error);
    }
  }

  createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
    dateOfBirth?: string;
    status?: UserStatus;
  }): number {
    const account: UserRecord = {
      id: this.nextId.users++,
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      emailVerified: false,
      profileCompleted: false,
      onboardingCompleted: false,
      status: input.status ?? "active",
      dateOfBirth: input.dateOfBirth,
    };

    this.data.users.push(account);
    this.saveToFile();
    return account.id;
  }

  updateUser(id: number, updates: Partial<UserRecord>): UserRecord | undefined {
    const index = this.data.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return undefined;
    }

    const nextUser = {
      ...this.data.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data.users[index] = nextUser;
    this.saveToFile();
    return nextUser;
  }

  getUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: number): UserRecord | undefined {
    return this.data.users.find((user) => user.id === id);
  }

  getProfileByUserId(userId: number): ProfileRecord | undefined {
    return this.data.profiles.find((profile) => profile.userId === userId);
  }

  createOrUpdateProfile(userId: number, profileInput: Partial<ProfileRecord>): ProfileRecord {
    const existing = this.getProfileByUserId(userId);
    const now = new Date().toISOString();

    if (existing) {
      const nextProfile: ProfileRecord = {
        ...existing,
        ...profileInput,
        userId,
        updatedAt: now,
      };

      this.data.profiles = this.data.profiles.map((profile) => (profile.userId === userId ? nextProfile : profile));
      this.saveToFile();
      return nextProfile;
    }

    const nextProfile: ProfileRecord = {
      id: this.nextId.profiles++,
      userId,
      firstName: profileInput.firstName ?? "",
      displayName: profileInput.displayName ?? "",
      dateOfBirth: profileInput.dateOfBirth ?? "",
      gender: profileInput.gender ?? "prefer-not-to-say",
      pronouns: profileInput.pronouns,
      city: profileInput.city ?? "",
      region: profileInput.region,
      country: profileInput.country ?? "",
      bio: profileInput.bio ?? "",
      headline: profileInput.headline ?? "",
      relationshipIntent: profileInput.relationshipIntent ?? "serious-dating",
      profilePhoto: profileInput.profilePhoto,
      createdAt: now,
      updatedAt: now,
    };

    this.data.profiles.push(nextProfile);
    this.saveToFile();
    return nextProfile;
  }

  addProfilePhoto(input: { userId: number; url: string; isPrimary?: boolean }): ProfilePhotoRecord {
    const photo: ProfilePhotoRecord = {
      id: this.nextId.profilePhotos++,
      userId: input.userId,
      url: input.url,
      isPrimary: input.isPrimary ?? false,
      sortOrder: this.data.profilePhotos.filter((item) => item.userId === input.userId).length,
      createdAt: new Date().toISOString(),
    };

    if (input.isPrimary || this.data.profilePhotos.filter((item) => item.userId === input.userId && item.isPrimary).length === 0) {
      this.data.profilePhotos = this.data.profilePhotos.map((item) => (item.userId === input.userId ? { ...item, isPrimary: false } : item));
      photo.isPrimary = true;
    }

    this.data.profilePhotos.push(photo);
    this.saveToFile();
    return photo;
  }

  getProfilePhotosByUserId(userId: number): ProfilePhotoRecord[] {
    return this.data.profilePhotos
      .filter((photo) => photo.userId === userId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));
  }

  deleteProfilePhoto(userId: number, photoId: number): boolean {
    const before = this.data.profilePhotos.filter((photo) => photo.userId === userId);
    this.data.profilePhotos = this.data.profilePhotos.filter((photo) => !(photo.userId === userId && photo.id === photoId));

    const remaining = this.data.profilePhotos.filter((photo) => photo.userId === userId);
    if (remaining.length > 0 && !remaining.some((photo) => photo.isPrimary)) {
      remaining[0].isPrimary = true;
    }

    if (before.length !== this.data.profilePhotos.filter((photo) => photo.userId === userId).length) {
      this.saveToFile();
      return true;
    }

    return false;
  }

  setPrimaryProfilePhoto(userId: number, photoId: number): boolean {
    const updated = this.data.profilePhotos.map((photo) => {
      if (photo.userId !== userId) {
        return photo;
      }

      return { ...photo, isPrimary: photo.id === photoId };
    });

    this.data.profilePhotos = updated;
    const changed = updated.some((photo) => photo.userId === userId && photo.id === photoId && photo.isPrimary);
    if (changed) {
      this.saveToFile();
    }

    return changed;
  }

  getUserInterests(userId: number): UserInterestRecord[] {
    return this.data.userInterests.filter((item) => item.userId === userId);
  }

  setUserInterests(userId: number, interestIds: string[]): UserInterestRecord[] {
    this.data.userInterests = this.data.userInterests.filter((item) => item.userId !== userId);

    const nextItems = interestIds.map((interestId, index) => ({
      id: this.nextId.userInterests++,
      userId,
      interestId,
      createdAt: new Date(Date.now() + index).toISOString(),
    }));

    this.data.userInterests.push(...nextItems);
    this.saveToFile();
    return nextItems;
  }

  getLifestyleByUserId(userId: number): LifestyleRecord | undefined {
    return this.data.lifestyles.find((item) => item.userId === userId);
  }

  upsertLifestyle(userId: number, lifestyle: Partial<LifestyleRecord>): LifestyleRecord {
    const existing = this.getLifestyleByUserId(userId);
    const now = new Date().toISOString();

    if (existing) {
      const nextLifestyle: LifestyleRecord = {
        ...existing,
        ...lifestyle,
        userId,
        updatedAt: now,
      };
      this.data.lifestyles = this.data.lifestyles.map((item) => (item.userId === userId ? nextLifestyle : item));
      this.saveToFile();
      return nextLifestyle;
    }

    const nextLifestyle: LifestyleRecord = {
      id: this.nextId.lifestyles++,
      userId,
      education: lifestyle.education,
      occupation: lifestyle.occupation,
      smoking: lifestyle.smoking,
      drinking: lifestyle.drinking,
      exercise: lifestyle.exercise,
      children: lifestyle.children,
      wantsChildren: lifestyle.wantsChildren,
      pets: lifestyle.pets,
      languages: lifestyle.languages ?? [],
      createdAt: now,
      updatedAt: now,
    };

    this.data.lifestyles.push(nextLifestyle);
    this.saveToFile();
    return nextLifestyle;
  }

  getPreferencesByUserId(userId: number): DatingPreferencesRecord | undefined {
    return this.data.preferences.find((preference) => preference.userId === userId);
  }

  upsertPreferences(userId: number, preferences: Partial<DatingPreferencesRecord>): DatingPreferencesRecord {
    const existing = this.getPreferencesByUserId(userId);
    const now = new Date().toISOString();

    if (existing) {
      const nextPreferences: DatingPreferencesRecord = {
        ...existing,
        ...preferences,
        userId,
        updatedAt: now,
      };
      this.data.preferences = this.data.preferences.map((item) => (item.userId === userId ? nextPreferences : item));
      this.saveToFile();
      return nextPreferences;
    }

    const nextPreferences: DatingPreferencesRecord = {
      id: this.nextId.preferences++,
      userId,
      ageMin: preferences.ageMin ?? 18,
      ageMax: preferences.ageMax ?? 40,
      preferredGender: preferences.preferredGender ?? ["woman", "man"],
      preferredLocation: preferences.preferredLocation ?? "",
      maxDistanceKm: preferences.maxDistanceKm ?? 100,
      relationshipIntent: preferences.relationshipIntent ?? ["serious-dating"],
      interests: preferences.interests ?? [],
      createdAt: now,
      updatedAt: now,
    };

    this.data.preferences.push(nextPreferences);
    this.saveToFile();
    return nextPreferences;
  }

  getPublishedOrganizerCards(): OrganizerCardRecord[] {
    return this.data.organizer_cards.filter((card) => card.is_published);
  }

  createEvent(input: {
    name: string;
    date: string;
    location?: string;
    description?: string;
    organizer_id: number;
  }): number {
    const event: EventRecord = {
      id: this.nextId.events++,
      name: input.name,
      date: input.date,
      location: input.location || null,
      description: input.description || null,
      organizer_id: input.organizer_id,
      created_at: new Date().toISOString(),
    };
    this.data.events.push(event);
    this.saveToFile();
    return event.id;
  }

  getEventById(id: number): EventRecord | undefined {
    return this.data.events.find((event) => event.id === id);
  }

  getAllEvents(): EventRecord[] {
    return [...this.data.events].sort((a, b) => a.date.localeCompare(b.date));
  }

  getEventsByOrganizer(organizerId: number): EventRecord[] {
    return this.data.events
      .filter((event) => event.organizer_id === organizerId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  updateEvent(id: number, input: { name: string; date: string; location?: string; description?: string }): void {
    const event = this.data.events.find((item) => item.id === id);
    if (event) {
      event.name = input.name;
      event.date = input.date;
      event.location = input.location || null;
      event.description = input.description || null;
      this.saveToFile();
    }
  }

  deleteEvent(id: number): void {
    this.data.events = this.data.events.filter((event) => event.id !== id);
    this.data.guests = this.data.guests.filter((guest) => guest.event_id !== id);
    this.saveToFile();
  }

  addGuest(input: { event_id: number; name: string; email: string }): number {
    const guest: GuestRecord = {
      id: this.nextId.guests++,
      event_id: input.event_id,
      name: input.name,
      email: input.email,
      rsvp_status: "Pending",
      created_at: new Date().toISOString(),
    };

    this.data.guests.push(guest);
    this.saveToFile();
    return guest.id;
  }

  getGuestsByEventId(eventId: number): GuestRecord[] {
    return this.data.guests
      .filter((guest) => guest.event_id === eventId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  deleteGuest(id: number): void {
    this.data.guests = this.data.guests.filter((guest) => guest.id !== id);
    this.saveToFile();
  }

  getAllUsers(): UserRecord[] {
    return [...this.data.users];
  }

  getUserCount(): number {
    return this.data.users.length;
  }

  getLikesByUserId(userId: number): LikeRecord[] {
    return this.data.likes.filter((like) => like.fromUserId === userId);
  }

  getIncomingLikesByUserId(userId: number): LikeRecord[] {
    return this.data.likes.filter((like) => like.toUserId === userId);
  }

  hasLiked(fromUserId: number, toUserId: number): boolean {
    return this.data.likes.some((like) => like.fromUserId === fromUserId && like.toUserId === toUserId);
  }

  createLike(fromUserId: number, toUserId: number): LikeRecord | null {
    if (fromUserId === toUserId || this.hasLiked(fromUserId, toUserId)) {
      return null;
    }

    const targetUser = this.getUserById(toUserId);
    if (!targetUser || targetUser.status !== "active") {
      return null;
    }

    const nextLike: LikeRecord = {
      id: this.nextId.likes++,
      fromUserId,
      toUserId,
      createdAt: new Date().toISOString(),
    };

    this.data.likes.push(nextLike);
    this.saveToFile();
    return nextLike;
  }

  getPassesByUserId(userId: number): PassRecord[] {
    return this.data.passes.filter((pass) => pass.fromUserId === userId);
  }

  hasPassed(fromUserId: number, toUserId: number): boolean {
    return this.data.passes.some((pass) => pass.fromUserId === fromUserId && pass.toUserId === toUserId);
  }

  createPass(fromUserId: number, toUserId: number): PassRecord | null {
    if (fromUserId === toUserId || this.hasPassed(fromUserId, toUserId)) {
      return null;
    }

    const targetUser = this.getUserById(toUserId);
    if (!targetUser || targetUser.status !== "active") {
      return null;
    }

    const nextPass: PassRecord = {
      id: this.nextId.passes++,
      fromUserId,
      toUserId,
      createdAt: new Date().toISOString(),
    };

    this.data.passes.push(nextPass);
    this.saveToFile();
    return nextPass;
  }

  getBlockedUserIds(userId: number): number[] {
    return this.data.blocks.filter((block) => block.blockerUserId === userId).map((block) => block.blockedUserId);
  }

  createMatch(userAId: number, userBId: number): MatchRecord {
    const ordered = userAId < userBId ? [userAId, userBId] : [userBId, userAId];
    const now = new Date().toISOString();
    const existing = this.data.matches.find(
      (match) =>
        (match.userAId === ordered[0] && match.userBId === ordered[1]) ||
        (match.userAId === ordered[1] && match.userBId === ordered[0]),
    );

    if (existing) {
      return existing;
    }

    const nextMatch: MatchRecord = {
      id: this.nextId.matches++,
      userAId: ordered[0],
      userBId: ordered[1],
      createdAt: now,
      status: "active",
    };

    this.data.matches.push(nextMatch);
    this.saveToFile();
    return nextMatch;
  }

  findMatch(userAId: number, userBId: number): MatchRecord | undefined {
    const ordered = userAId < userBId ? [userAId, userBId] : [userBId, userAId];
    return this.data.matches.find(
      (match) =>
        (match.userAId === ordered[0] && match.userBId === ordered[1]) ||
        (match.userAId === ordered[1] && match.userBId === ordered[0]),
    );
  }

  getMatchesByUserId(userId: number): MatchRecord[] {
    return this.data.matches.filter((match) => match.userAId === userId || match.userBId === userId);
  }

  getConversationById(id: number): ConversationRecord | undefined {
    return this.data.conversations.find((conversation) => conversation.id === id);
  }

  getConversationByMatchId(matchId: number): ConversationRecord | undefined {
    return this.data.conversations.find((conversation) => conversation.matchId === matchId);
  }

  getConversationsByUserId(userId: number): ConversationRecord[] {
    return this.data.conversations.filter((conversation) => conversation.participantIds.includes(userId));
  }

  createConversationForMatch(matchId: number, participantIds: number[]): ConversationRecord | null {
    const match = this.data.matches.find((entry) => entry.id === matchId);
    if (!match) {
      return null;
    }

    const normalizedParticipants = [...new Set(participantIds)].sort((a, b) => a - b);
    if (normalizedParticipants.length !== 2) {
      return null;
    }

    const hasParticipants = normalizedParticipants.includes(match.userAId) && normalizedParticipants.includes(match.userBId);
    if (!hasParticipants) {
      return null;
    }

    if (this.data.conversations.some((conversation) => conversation.matchId === matchId)) {
      return this.data.conversations.find((conversation) => conversation.matchId === matchId) ?? null;
    }

    const now = new Date().toISOString();
    const nextConversation: ConversationRecord = {
      id: this.nextId.conversations++,
      matchId,
      participantIds: normalizedParticipants,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      lastMessagePreview: "Start the conversation",
    };

    this.data.conversations.push(nextConversation);
    this.saveToFile();
    return nextConversation;
  }

  isConversationParticipant(conversationId: number, userId: number): boolean {
    const conversation = this.getConversationById(conversationId);
    return Boolean(conversation && conversation.participantIds.includes(userId));
  }

  getMessagesByConversationId(conversationId: number): MessageRecord[] {
    return this.data.messages
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  createMessage(input: { conversationId: number; senderId: number; body: string }): MessageRecord | null {
    const conversation = this.getConversationById(input.conversationId);
    if (!conversation) {
      return null;
    }

    if (!conversation.participantIds.includes(input.senderId)) {
      return null;
    }

    const trimmed = input.body.trim();
    if (!trimmed || trimmed.length > 2000) {
      return null;
    }

    const nextMessage: MessageRecord = {
      id: this.nextId.messages++,
      conversationId: input.conversationId,
      senderId: input.senderId,
      body: trimmed,
      createdAt: new Date().toISOString(),
    };

    this.data.messages.push(nextMessage);
    conversation.lastMessageAt = nextMessage.createdAt;
    conversation.lastMessagePreview = trimmed;
    conversation.updatedAt = nextMessage.createdAt;
    this.saveToFile();
    return nextMessage;
  }

  markMessagesAsRead(conversationId: number, userId: number): number {
    const conversation = this.getConversationById(conversationId);
    if (!conversation || !conversation.participantIds.includes(userId)) {
      return 0;
    }

    const now = new Date().toISOString();
    let updated = 0;

    this.data.messages = this.data.messages.map((message) => {
      const isIncoming = message.conversationId === conversationId && message.senderId !== userId && !message.readAt;
      if (!isIncoming) {
        return message;
      }
      updated += 1;
      return { ...message, readAt: now };
    });

    if (updated > 0) {
      this.saveToFile();
    }

    return updated;
  }

  getUnreadMessageCountForUser(userId: number, conversationId?: number): number {
    return this.data.messages.filter((message) => {
      const belongsToConversation = conversationId === undefined || message.conversationId === conversationId;
      return belongsToConversation && message.senderId !== userId && !message.readAt;
    }).length;
  }
}

const db = new SimpleDB();

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  dateOfBirth?: string;
  status?: UserStatus;
}): number {
  return db.createUser(input);
}

export function getUserByEmail(email: string): UserRecord | undefined {
  return db.getUserByEmail(email);
}

export function getUserById(id: number): UserRecord | undefined {
  return db.getUserById(id);
}

export function updateUser(id: number, updates: Partial<UserRecord>): UserRecord | undefined {
  return db.updateUser(id, updates);
}

export function getProfileByUserId(userId: number): ProfileRecord | undefined {
  return db.getProfileByUserId(userId);
}

export function createOrUpdateProfile(userId: number, profileInput: Partial<ProfileRecord>): ProfileRecord {
  return db.createOrUpdateProfile(userId, profileInput);
}

export function addProfilePhoto(input: { userId: number; url: string; isPrimary?: boolean }): ProfilePhotoRecord {
  return db.addProfilePhoto(input);
}

export function getProfilePhotosByUserId(userId: number): ProfilePhotoRecord[] {
  return db.getProfilePhotosByUserId(userId);
}

export function deleteProfilePhoto(userId: number, photoId: number): boolean {
  return db.deleteProfilePhoto(userId, photoId);
}

export function setPrimaryProfilePhoto(userId: number, photoId: number): boolean {
  return db.setPrimaryProfilePhoto(userId, photoId);
}

export function getUserInterests(userId: number): UserInterestRecord[] {
  return db.getUserInterests(userId);
}

export function setUserInterests(userId: number, interestIds: string[]): UserInterestRecord[] {
  return db.setUserInterests(userId, interestIds);
}

export function getLifestyleByUserId(userId: number): LifestyleRecord | undefined {
  return db.getLifestyleByUserId(userId);
}

export function upsertLifestyle(userId: number, lifestyle: Partial<LifestyleRecord>): LifestyleRecord {
  return db.upsertLifestyle(userId, lifestyle);
}

export function getPreferencesByUserId(userId: number): DatingPreferencesRecord | undefined {
  return db.getPreferencesByUserId(userId);
}

export function upsertPreferences(userId: number, preferences: Partial<DatingPreferencesRecord>): DatingPreferencesRecord {
  return db.upsertPreferences(userId, preferences);
}

export function getPublishedOrganizerCards(): OrganizerCardRecord[] {
  return db.getPublishedOrganizerCards();
}

export function createEvent(input: {
  name: string;
  date: string;
  location?: string;
  description?: string;
  organizer_id: number;
}): number {
  return db.createEvent(input);
}

export function getEventById(id: number): EventRecord | undefined {
  return db.getEventById(id);
}

export function getAllUsers(): UserRecord[] {
  return db.getAllUsers();
}

export function getUserCount(): number {
  return db.getUserCount();
}

export function getLikesByUserId(userId: number): LikeRecord[] {
  return db.getLikesByUserId(userId);
}

export function getIncomingLikesByUserId(userId: number): LikeRecord[] {
  return db.getIncomingLikesByUserId(userId);
}

export function hasLiked(fromUserId: number, toUserId: number): boolean {
  return db.hasLiked(fromUserId, toUserId);
}

export function createLike(fromUserId: number, toUserId: number): LikeRecord | null {
  return db.createLike(fromUserId, toUserId);
}

export function getPassesByUserId(userId: number): PassRecord[] {
  return db.getPassesByUserId(userId);
}

export function hasPassed(fromUserId: number, toUserId: number): boolean {
  return db.hasPassed(fromUserId, toUserId);
}

export function createPass(fromUserId: number, toUserId: number): PassRecord | null {
  return db.createPass(fromUserId, toUserId);
}

export function getBlockedUserIds(userId: number): number[] {
  return db.getBlockedUserIds(userId);
}

export function createMatch(userAId: number, userBId: number): MatchRecord {
  return db.createMatch(userAId, userBId);
}

export function findMatch(userAId: number, userBId: number): MatchRecord | undefined {
  return db.findMatch(userAId, userBId);
}

export function getMatchesByUserId(userId: number): MatchRecord[] {
  return db.getMatchesByUserId(userId);
}

export function getConversationById(id: number): ConversationRecord | undefined {
  return db.getConversationById(id);
}

export function getConversationByMatchId(matchId: number): ConversationRecord | undefined {
  return db.getConversationByMatchId(matchId);
}

export function getConversationsByUserId(userId: number): ConversationRecord[] {
  return db.getConversationsByUserId(userId);
}

export function createConversationForMatch(matchId: number, participantIds: number[]): ConversationRecord | null {
  return db.createConversationForMatch(matchId, participantIds);
}

export function isConversationParticipant(conversationId: number, userId: number): boolean {
  return db.isConversationParticipant(conversationId, userId);
}

export function getMessagesByConversationId(conversationId: number): MessageRecord[] {
  return db.getMessagesByConversationId(conversationId);
}

export function createMessage(input: { conversationId: number; senderId: number; body: string }): MessageRecord | null {
  return db.createMessage(input);
}

export function markMessagesAsRead(conversationId: number, userId: number): number {
  return db.markMessagesAsRead(conversationId, userId);
}

export function getUnreadMessageCountForUser(userId: number, conversationId?: number): number {
  return db.getUnreadMessageCountForUser(userId, conversationId);
}

export function getAllEvents(): EventRecord[] {
  return db.getAllEvents();
}

export function getEventsByOrganizer(organizerId: number): EventRecord[] {
  return db.getEventsByOrganizer(organizerId);
}

export function updateEvent(id: number, input: { name: string; date: string; location?: string; description?: string }): void {
  db.updateEvent(id, input);
}

export function deleteEvent(id: number): void {
  db.deleteEvent(id);
}

export function addGuest(input: { event_id: number; name: string; email: string }): number {
  return db.addGuest(input);
}

export function getGuestsByEventId(eventId: number): GuestRecord[] {
  return db.getGuestsByEventId(eventId);
}

export function deleteGuest(id: number): void {
  db.deleteGuest(id);
}
