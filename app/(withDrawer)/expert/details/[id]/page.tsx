
import ExpertDetail from "@/app/ui/expert/expert-detail";
import { getExpert } from "@/app/lib/server";

export default async function Page({ params }: { params: { id: string } }) {
  const expert = await getExpert(params.id)
  
  return (
    <div>
      {expert ?
        (<div className="max-w-full">
          <ExpertDetail expertData={JSON.stringify(expert)} />
        </div>
        ) :
        (<>Chuyên gia không tồn tại</>)
      }
    </div>

  );

}
