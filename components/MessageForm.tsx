
import React from 'react';
import { Category, DeliveryMethod, MessageInputs, SendPreference } from '../types';

interface MessageFormProps {
  onGenerate: (inputs: MessageInputs) => void;
  isLoading: boolean;
}

const CATEGORY_SUGGESTIONS: Record<Category, string[]> = {
  [Category.CRUSH]: [
    "I've liked them for 2 years...", 
    "We always grab coffee on Tuesdays, I want to ask her on a real date.", 
    "Express feelings beyond friendship...",
    "Confess I can't stop thinking about our last chat..."
  ],
  [Category.RESIGNATION]: [
    "Leaving because I found a higher-paying job...", 
    "Pursuing personal projects...", 
    "Resigning for mental health reasons...",
    "Moving to a different city..."
  ],
  [Category.APOLOGY]: [
    "Forgot a big event...", 
    "Said something insensitive and feel terrible...", 
    "Haven't been present lately...",
    "Messed up a shared responsibility..."
  ],
  [Category.FAMILY_FRIENDS]: [
    "Checking in after months of silence...", 
    "Can't make it for holidays...", 
    "Apologizing for being distant...",
    "Sharing some big personal news..."
  ],
  [Category.PROFESSIONAL]: [
    "Asking for a raise...", 
    "Deadline extension needed...", 
    "Job application follow-up...",
    "Reporting a technical issue..."
  ],
  [Category.BOUNDARY]: [
    "Can't lend money right now...", 
    "No work talk after hours...", 
    "Need more space in this relationship...",
    "Declining a social invitation politely..."
  ],
  [Category.FIRST_DATE_FOLLOWUP]: [
    "Want a second date...", 
    "No spark, being honest...", 
    "Had a blast, let's do it again...",
    "Thanks for the coffee, maybe just friends?"
  ],
  [Category.NETWORKING]: [
    "15-minute coffee chat...", 
    "Follow-up from conference...", 
    "Ask for introduction...",
    "Inquiring about their career path..."
  ],
  [Category.FAVOR]: [
    "Place to stay...", 
    "Character reference...", 
    "Help moving furniture...",
    "Watering plants while away..."
  ],
  [Category.CONDOLENCE]: [
    "Sorry for loss...", 
    "Thinking of them during this hard time...", 
    "Offer to bring over dinner...",
    "Sharing a fond memory..."
  ],
  [Category.CONFLICT]: [
    "Clear the air about what happened...", 
    "Hurt feelings discussion...", 
    "Resolve misunderstanding...",
    "Suggesting a neutral talk in person..."
  ],
  [Category.CLARIFICATION]: [
    "Didn't understand the instructions...",
    "Confused about project scope...",
    "Need more details on timing...",
    "Confirming the budget details..."
  ],
  [Category.SUPPORT]: [
    "Heard they are struggling...",
    "Offer help with workload...",
    "Letting them know I'm here...",
    "Supporting them after a tough breakup..."
  ],
  [Category.GRATITUDE]: [
    "Thanking a mentor...",
    "Appreciating a small favor...",
    "Thanks for the emotional support...",
    "Valuing their contribution to the team..."
  ],
  [Category.GHOSTING_RECOVERY]: [
    "Reconnecting after months of unintended silence...",
    "Apologizing for disappearing and asking to hang out...",
    "Checking in after a long period of ghosting...",
    "Acknowledging the distance and trying to repair the bond..."
  ],
  [Category.DATE_REJECTION]: [
    "Saying there was no romantic spark after a first date...",
    "Declining a second date invitation politely...",
    "Ending a short term dating situation honestly...",
    "Explaining that you're not ready for a relationship right now..."
  ],
  [Category.ROOMMATE_ISSUE]: [
    "Addressing unclean common areas...",
    "Talking about loud noise late at night...",
    "Reminding about overdue utility bills...",
    "Requesting a change in guest policy..."
  ],
  [Category.GIFT_AWKWARDNESS]: [
    "Explaining why you need to exchange a thoughtful gift...",
    "Politely declining an expensive gift you can't accept...",
    "Late thank you for a gift received months ago...",
    "Asking for a gift receipt without sounding ungrateful..."
  ],
  [Category.LAST_MINUTE_CANCEL]: [
    "Cancelling dinner plans an hour before...",
    "Rescheduling an important meeting last minute...",
    "Backing out of a trip due to an emergency...",
    "Moving a date because you're feeling overwhelmed..."
  ],
  [Category.PEER_FEEDBACK]: [
    "Addressing a colleague's constant interruptions...",
    "Suggesting improvements to a teammate's workflow...",
    "Giving feedback on a presentation that lacked detail...",
    "Telling a peer their communication style is too aggressive..."
  ],
  [Category.LOAN_REMINDER]: [
    "Gentle reminder about the $50 for dinner...",
    "Asking for back rent that is two weeks late...",
    "Requesting a timeline for when they can pay you back...",
    "Explaining why you need the borrowed money returned now..."
  ],
  [Category.MAJOR_EVENT_DECLINE]: [
    "Declining a destination wedding invite...",
    "Can't make it to a milestone birthday party...",
    "Saying no to a baby shower due to prior commitments...",
    "Regretfully missing a family reunion..."
  ],
  [Category.FIRMING_UP_PLANS]: [
    "Pinning down a 'maybe' for Friday night...",
    "Asking for a specific time and location for vague plans...",
    "Checking if 'grabbing coffee sometime' can be tomorrow...",
    "Following up on a loose suggestion to hang out..."
  ],
  [Category.MENTORSHIP_ASK]: [
    "Asking a senior leader for career guidance...",
    "Inquiring if someone would be your formal mentor...",
    "Requesting a one-off advice session about your career path...",
    "Asking a former boss for professional mentorship..."
  ],
  // 20 New Categories
  [Category.GROUP_CHAT_EXIT]: [
    "Leaving a busy work group chat...",
    "Quietly exiting a toxic social group...",
    "Explaining why I need to leave a family thread...",
    "Turning off notifications for a large group..."
  ],
  [Category.LANDLORD_REPAIR]: [
    "Kitchen sink is leaking...",
    "No hot water in the bathroom...",
    "Asking for mold inspection...",
    "Requesting outdoor light fixes..."
  ],
  [Category.NEIGHBOR_NOISE]: [
    "Loud music at 2 AM...",
    "Dog barking constantly...",
    "Construction starting too early...",
    "Trash left in the hallway..."
  ],
  [Category.BORROWING_ITEM]: [
    "Borrowing a lawnmower for the weekend...",
    "Asking for a spare charging cable...",
    "Requesting tools for a DIY project...",
    "Borrowing extra chairs for a party..."
  ],
  [Category.RETURNING_ITEM]: [
    "Returning a book I've had for months...",
    "Giving back borrowed clothes...",
    "Returning a vacuum cleaner with thanks...",
    "Replacing an item I accidentally broke..."
  ],
  [Category.SUBSCRIPTION_CANCEL]: [
    "Canceling a gym membership politely...",
    "Ending a software subscription...",
    "Quitting a wine or coffee club...",
    "Explaining budget cuts for a service..."
  ],
  [Category.WEDDING_PLUS_ONE]: [
    "Asking to bring a new partner...",
    "Requesting a guest spot for a long-distance friend...",
    "Clarifying if my invite was for two...",
    "Respectfully asking for a plus-one after the deadline..."
  ],
  [Category.DIETARY_NEEDS]: [
    "Mentioning a severe nut allergy...",
    "Confirming vegan options for a dinner party...",
    "Letting the host know about gluten intolerance...",
    "Asking for a non-alcoholic drink list..."
  ],
  [Category.GRADE_DISPUTE]: [
    "I think my essay was graded too harshly...",
    "Asking for clarification on a failed exam...",
    "Requesting a regrade for a final project...",
    "Discussing participation points..."
  ],
  [Category.CREATIVE_COLLAB]: [
    "Starting a podcast together...",
    "Inviting a writer to co-author a story...",
    "Asking a musician for a feature...",
    "Proposing a mural collaboration..."
  ],
  [Category.EX_PARTNER_CONTACT]: [
    "Asking for my apartment keys back...",
    "Returning their personal belongings...",
    "Discussing shared custody of a pet...",
    "Formal closure message after a break..."
  ],
  [Category.REVIEW_REQUEST]: [
    "Asking a happy client for a 5-star review...",
    "Requesting feedback on LinkedIn...",
    "Asking a local for a Google Maps review...",
    "Asking a buyer for Etsy shop feedback..."
  ],
  [Category.BUSINESS_COMPLAINT]: [
    "Reporting poor service at a restaurant...",
    "Defective item received in mail...",
    "Rude staff interaction feedback...",
    "Invoicing error report..."
  ],
  [Category.ESTRANGED_RELATIVE]: [
    "Reaching out to a sibling after years...",
    "Wishing an estranged parent a happy holiday...",
    "Asking to clear the air about old drama...",
    "Inviting a distant cousin to a meetup..."
  ],
  [Category.LOAN_REQUEST]: [
    "Asking a close friend for a small emergency loan...",
    "Requesting help with this month's rent...",
    "Borrowing money for car repairs...",
    "Asking a relative for a business startup loan..."
  ],
  [Category.PARTNER_MONEY_TALK]: [
    "Discussing shared budget for groceries...",
    "Talking about high dining-out expenses...",
    "Proposing a savings goal for a trip...",
    "Addressing debt in the relationship..."
  ],
  [Category.FRIENDSHIP_SPACE]: [
    "I need a social detox weekend...",
    "Asking a friend to text less often...",
    "Explaining why I'm taking a break from plans...",
    "Setting a boundary on daily vent sessions..."
  ],
  [Category.GYM_PARTNER]: [
    "Asking someone to spot me...",
    "Inviting a friend to a morning spin class...",
    "Proposing a weekly training schedule...",
    "Looking for a local running buddy..."
  ],
  [Category.ADVISOR_ASK]: [
    "Asking a professor to be my thesis advisor...",
    "Requesting a regular check-in for my research...",
    "Asking for academic guidance on a major change...",
    "Seeking a mentor for grad school applications..."
  ],
  [Category.CREDIT_RECLAIM]: [
    "Politely noting my contribution to a group project...",
    "Clarifying my role in a successful presentation...",
    "Reclaiming credit for an idea taken in a meeting...",
    "Asking to be listed as a co-contributor..."
  ]
};

const MessageForm: React.FC<MessageFormProps> = ({ onGenerate, isLoading }) => {
  const [inputs, setInputs] = React.useState<MessageInputs>({
    category: Category.CRUSH,
    receiver: '',
    senderName: '',
    isAnonymous: false,
    receiverEmail: '',
    receiverPhone: '',
    keyDetails: '',
    deliveryMethod: DeliveryMethod.WHATSAPP,
    sendPreference: SendPreference.SELF,
    includeEmojis: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(inputs);
  };

  const isEmail = inputs.deliveryMethod === DeliveryMethod.EMAIL;
  const isPhoneRequired = inputs.deliveryMethod === DeliveryMethod.WHATSAPP || inputs.deliveryMethod === DeliveryMethod.ANONYMOUS_SMS;
  const isEmissary = inputs.sendPreference === SendPreference.EMISSARY;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-10">
      {/* Configuration Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Channel</label>
          <select
            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-medium transition-all text-slate-900 bg-white"
            value={inputs.deliveryMethod}
            onChange={(e) => setInputs({ ...inputs, deliveryMethod: e.target.value as DeliveryMethod })}
          >
            {Object.values(DeliveryMethod).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Delivery Strategy</label>
            {isEmissary && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 animate-pulse">
                500 ₦ Premium Fee
              </span>
            )}
          </div>
          <div className="relative group">
            <select
              className={`w-full px-5 py-3.5 rounded-2xl border focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-900 bg-white ${isEmissary ? 'border-emerald-200 focus:border-emerald-500' : 'border-slate-200 focus:border-indigo-500'}`}
              value={inputs.sendPreference}
              onChange={(e) => setInputs({ ...inputs, sendPreference: e.target.value as SendPreference })}
            >
              {Object.values(SendPreference).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              {inputs.sendPreference === SendPreference.SELF 
                ? "Self-Send: Polished scripts for your own use." 
                : "Emissary: A mediator delivers it for you (500 ₦)."}
            </p>
          </div>
        </div>
      </div>

      {/* Identities Section & Emoji Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recipient Card */}
        <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recipient</h3>
          <input
            required
            placeholder="Their Name (e.g. Jessica)"
            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900 bg-white"
            value={inputs.receiver}
            onChange={(e) => setInputs({ ...inputs, receiver: e.target.value })}
          />
          {isEmail && (
            <input required placeholder="Email Address" type="email" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900 bg-white" value={inputs.receiverEmail} onChange={(e) => setInputs({ ...inputs, receiverEmail: e.target.value })} />
          )}
          {isPhoneRequired && (
            <input required placeholder="Phone Number" type="tel" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900 bg-white" value={inputs.receiverPhone} onChange={(e) => setInputs({ ...inputs, receiverPhone: e.target.value })} />
          )}
        </div>

        {/* Sender Card & Emoji Toggle */}
        <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Your Identity</h3>
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-indigo-500 transition-colors">Anonymous</span>
                <div className="relative inline-block w-8 h-4">
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={inputs.isAnonymous} 
                    onChange={(e) => setInputs({...inputs, isAnonymous: e.target.checked})} 
                  />
                  <div className={`w-full h-full rounded-full transition-colors ${inputs.isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${inputs.isAnonymous ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
            <input
              disabled={inputs.isAnonymous}
              placeholder={inputs.isAnonymous ? "Staying Anonymous" : "Your Name"}
              className={`w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm transition-all font-medium bg-white ${inputs.isAnonymous ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-transparent' : 'text-slate-900'}`}
              value={inputs.senderName}
              onChange={(e) => setInputs({ ...inputs, senderName: e.target.value })}
              required={!inputs.isAnonymous}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 mt-2 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Emoji Polish</span>
             </div>
             <label className="relative inline-block w-10 h-5 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={inputs.includeEmojis} 
                  onChange={(e) => setInputs({...inputs, includeEmojis: e.target.checked})} 
                />
                <div className={`w-full h-full rounded-full transition-colors ${inputs.includeEmojis ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${inputs.includeEmojis ? 'translate-x-5' : ''}`}></div>
              </label>
          </div>
        </div>
      </div>

      {/* Vibe Starters */}
      <div className="space-y-4">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Relationship Context</label>
        <select
          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 mb-4 font-medium text-slate-900 bg-white shadow-sm"
          value={inputs.category}
          onChange={(e) => setInputs({ ...inputs, category: e.target.value as Category })}
        >
          {Object.values(Category).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_SUGGESTIONS[inputs.category].map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputs(prev => ({ ...prev, keyDetails: s }))}
              className={`px-4 py-2 text-xs rounded-xl border transition-all font-bold ${inputs.keyDetails === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-black text-slate-900 uppercase tracking-widest">The Raw Truth</label>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{inputs.keyDetails.length}/2000</span>
        </div>
        <textarea
          required
          rows={4}
          maxLength={2000}
          placeholder="Speak your raw, awkward thoughts here. The Emissary will turn this into something meaningful."
          className="w-full px-6 py-4 rounded-[1.5rem] border border-slate-200 focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none resize-none shadow-md bg-white font-medium text-slate-900 transition-all"
          value={inputs.keyDetails}
          onChange={(e) => setInputs({ ...inputs, keyDetails: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-6 rounded-[1.5rem] font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all transform active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none uppercase tracking-widest text-sm"
      >
        {isLoading ? "Consulting Social Intelligence..." : "Refine My Message"}
      </button>
    </form>
  );
};

export default MessageForm;
