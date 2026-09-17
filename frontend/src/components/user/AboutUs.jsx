import React from 'react';
import { Store, ShieldCheck, Zap, Users } from 'lucide-react';

export default function AboutUs() {
    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto bg-slate-50">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30">
                        <Store size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">About Smart POS</h1>
                    <p className="text-slate-500 text-xs max-w-lg mx-auto">
                        Smart POS is a modern, fast, and scalable Point of Sale system built for retail management, inventory tracking, and billing efficiency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl text-center space-y-2">
                        <Zap className="mx-auto text-blue-600" size={28} />
                        <h3 className="font-bold text-slate-800 text-xs">Lightning Fast</h3>
                        <p className="text-[11px] text-slate-400">Perform quick checkouts and real-time stock updates seamlessly.</p>
                    </div>
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl text-center space-y-2">
                        <ShieldCheck className="mx-auto text-emerald-600" size={28} />
                        <h3 className="font-bold text-slate-800 text-xs">Secure & Reliable</h3>
                        <p className="text-[11px] text-slate-400">Authenticated cashiers and protected inventory controls.</p>
                    </div>
                    <div className="bg-white p-5 border border-slate-200 rounded-2xl text-center space-y-2">
                        <Users className="mx-auto text-purple-600" size={28} />
                        <h3 className="font-bold text-slate-800 text-xs">User Friendly</h3>
                        <p className="text-[11px] text-slate-400">Clean dashboard layout crafted for intuitive customer interaction.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}