import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopTransactionValueCard = ({
  data = [],
  title = "Top Transaction Value",
}) => {
  // Handle empty or undefined data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-urbanist font-semibold text-[#1E1E1E]">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-qreva-navy text-center py-4">
            No transaction data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-urbanist font-semibold text-[#1E1E1E]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="space-y-3 flex flex-col justify-between h-full">
          {data.map((item, idx) => (
            <div key={item.id || idx} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              {/* Icon container */}
              {item.icon && (
                <span className="w-6 h-6 flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.name || "Transaction"}
                    className="w-6 h-6"
                    style={
                      {
                        // CSS filter for #6EDAD0 color
                        //filter: 'invert(80%) sepia(23%) saturate(754%) hue-rotate(123deg) brightness(99%) contrast(81%)'
                      }
                    }
                  />
                </span>
              )}

              {/* Transaction name */}
              <span className="text-sm font-general font-medium text-[#808C91] sm:flex-1">
                {item.name || item.provider || item.typeCategory || item.category || item.type || item.channel || "Unknown"}
              </span>

              {/* Progress bar */}
              <div className="h-2 w-full flex-1 overflow-hidden rounded-full bg-[#D6DADB]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#084059",
                    width: `${item.percentage || item.percentageShare || item.percent || 60}%`,
                  }}
                ></div>
              </div>

              {/* Amount */}
              <span className="text-sm font-general font-medium leading-[124%] text-[#084059] sm:w-24 sm:text-right">
                N{(item.value || item.amount || item.totalVolume || item.totalAmount || item.total || 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopTransactionValueCard;
