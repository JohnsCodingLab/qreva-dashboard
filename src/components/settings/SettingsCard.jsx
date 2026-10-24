import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SettingsCard = ({ icon: Icon, title, description, onClick, iconColor = "text-primary", iconBgColor = "bg-primary/10" }) => {
    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow group h-full"
            onClick={onClick}
        >
            <CardContent className="p-6 flex flex-col items-start h-full">
                <div className={cn("p-3 rounded-full mb-4", iconBgColor)}>
                    <Icon className={cn("w-6 h-6", iconColor)} />
                </div>

                <h3 className="font-semibold text-lg mb-2 text-[#1E1E1E]">{title}</h3>

                <p className="text-sm text-qreva-navy mb-6 grow">
                    {description}
                </p>

                <div className="flex items-center text-[#FF7F50] font-medium text-sm group-hover:underline mt-auto">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                </div>
            </CardContent>
        </Card>
    );
};

export default SettingsCard;
