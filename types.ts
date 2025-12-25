
export enum Category {
  CRUSH = 'Crush',
  RESIGNATION = 'Resignation',
  APOLOGY = 'Apology',
  FAMILY_FRIENDS = 'Family & Friends',
  PROFESSIONAL = 'Professional Request',
  BOUNDARY = 'Setting a Boundary',
  FIRST_DATE_FOLLOWUP = 'First Date Follow-up',
  NETWORKING = 'Networking',
  FAVOR = 'Asking for a Favor',
  CONDOLENCE = 'Condolences',
  CONFLICT = 'Conflict Resolution',
  CLARIFICATION = 'Seeking Clarification',
  SUPPORT = 'Offering Support',
  GRATITUDE = 'Expressing Gratitude',
  GHOSTING_RECOVERY = 'Reconnecting after Silence',
  DATE_REJECTION = 'Ending a Dating Connection',
  ROOMMATE_ISSUE = 'Roommate Dynamics',
  GIFT_AWKWARDNESS = 'Handling Gift Issues',
  LAST_MINUTE_CANCEL = 'Last Minute Cancellations',
  PEER_FEEDBACK = 'Constructive Peer Feedback',
  LOAN_REMINDER = 'Requesting Money Back',
  MAJOR_EVENT_DECLINE = 'Declining a Major Invite',
  FIRMING_UP_PLANS = 'Firming Up Vague Plans',
  MENTORSHIP_ASK = 'Seeking Mentorship',
  // New Categories
  GROUP_CHAT_EXIT = 'Leaving a Group Chat',
  LANDLORD_REPAIR = 'Requesting a Repair',
  NEIGHBOR_NOISE = 'Neighbor Noise Issue',
  BORROWING_ITEM = 'Borrowing an Item',
  RETURNING_ITEM = 'Returning a Borrowed Item',
  SUBSCRIPTION_CANCEL = 'Canceling a Service',
  WEDDING_PLUS_ONE = 'Asking for a Plus-One',
  DIETARY_NEEDS = 'Dietary Restrictions',
  GRADE_DISPUTE = 'Academic Grade Dispute',
  CREATIVE_COLLAB = 'Creative Collaboration',
  EX_PARTNER_CONTACT = 'Contacting an Ex',
  REVIEW_REQUEST = 'Asking for a Review',
  BUSINESS_COMPLAINT = 'Business Complaint',
  ESTRANGED_RELATIVE = 'Reaching out to Family',
  LOAN_REQUEST = 'Asking for a Loan',
  PARTNER_MONEY_TALK = 'Financial Talk with Partner',
  FRIENDSHIP_SPACE = 'Asking for Friendship Space',
  GYM_PARTNER = 'Finding a Gym Buddy',
  ADVISOR_ASK = 'Seeking Academic Advisor',
  CREDIT_RECLAIM = 'Reclaiming Work Credit'
}

export enum DeliveryMethod {
  WHATSAPP = 'WhatsApp/Text',
  EMAIL = 'Email',
  ANONYMOUS_SMS = 'Anonymous SMS'
}

export enum SendPreference {
  SELF = 'I\'ll Send It',
  EMISSARY = 'Emissary Delivery'
}

export interface MessageInputs {
  category: Category;
  receiver: string;
  senderName: string;
  isAnonymous: boolean;
  receiverEmail?: string;
  receiverPhone?: string;
  keyDetails: string;
  deliveryMethod: DeliveryMethod;
  sendPreference: SendPreference;
  includeEmojis: boolean;
}

export interface EmissaryOption {
  type: 'Soft Touch' | 'Direct Route' | 'Icebreaker';
  message: string;
  description: string;
  subject?: string;
  imageUrl?: string;
}

export interface EmissaryResponse {
  options: EmissaryOption[];
}

export interface DispatchLog {
  id: string;
  timestamp: string;
  category: Category;
  recipient: string;
  recipientContact: string;
  senderName: string;
  isAnonymous: boolean;
  rawTruth: string;
  finalMessage: string;
  method: DeliveryMethod;
  preference: SendPreference;
  status: 'Pending' | 'Processing' | 'Sent' | 'Delivered' | 'Failed' | 'Archived' | 'Flagged';
  amount: number;
  imageUrl?: string;
}

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'New' | 'Read' | 'Resolved';
}
