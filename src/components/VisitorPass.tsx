import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Visitor } from '@/types/visitor';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';

interface VisitorPassProps {
  visitor: Visitor;
}

export const VisitorPass = forwardRef<HTMLDivElement, VisitorPassProps>(
  ({ visitor }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white text-gray-900 p-8 max-w-md mx-auto"
        style={{ width: '400px' }}
      >
        <div className="border-4 border-cyan-600 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-teal-500 p-6 text-white">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-center">VISITOR PASS</h1>
            <p className="text-center text-sm opacity-90">Smart VMS</p>
          </div>

          {/* Photo */}
          <div className="flex justify-center py-4 bg-gray-50">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-600">
              <img
                src={visitor.photo}
                alt={visitor.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Visitor Name</p>
              <p className="text-lg font-bold">{visitor.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">CNIC</p>
                <p className="text-sm font-medium">{visitor.cnic}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Contact</p>
                <p className="text-sm font-medium">{visitor.contact}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">House #</p>
                <p className="text-sm font-medium">{visitor.houseNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Resident</p>
                <p className="text-sm font-medium">{visitor.residentName}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Purpose</p>
              <p className="text-sm font-medium">{visitor.purpose}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Check-in Time</p>
              <p className="text-sm font-medium">
                {format(new Date(visitor.checkInTime), 'PPpp')}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center py-4 bg-gray-50 rounded-lg">
              <QRCodeSVG
                value={visitor.id}
                size={128}
                level="H"
                includeMargin
              />
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">
                Pass ID: {visitor.id}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Scan QR code at exit for check-out
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-3 text-center border-t-2 border-cyan-600">
            <p className="text-xs text-gray-600 font-semibold">
              This pass is valid for single entry only
            </p>
          </div>
        </div>
      </div>
    );
  }
);

VisitorPass.displayName = 'VisitorPass';
