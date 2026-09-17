import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactUs() {
    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto bg-slate-50">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Contact Us</h1>
                    <p className="text-slate-500 text-xs">Get in touch with store support or administrators</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Phone size={20} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">Phone Number</h4>
                                <p className="text-xs text-slate-500">+94 11 234 5678</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Mail size={20} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">Email Address</h4>
                                <p className="text-xs text-slate-500">support@smartpos.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={20} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">Location</h4>
                                <p className="text-xs text-slate-500">Main Street, Colombo, Sri Lanka</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Clock size={20} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">Operating Hours</h4>
                                <p className="text-xs text-slate-500">Mon - Sat: 8:00 AM - 8:00 PM</p>
                            </div>
                        </div>
                    </div>

                    <form className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-xs">Send Message</h3>
                        <input type="text" placeholder="Your Name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-500" />
                        <input type="email" placeholder="Your Email" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-500" />
                        <textarea rows="3" placeholder="Message" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-blue-500"></textarea>
                        <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-semibold transition">
                            Send Inquiry
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}