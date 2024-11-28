//icon
import { Upload } from "lucide-react";

// react papaparse csv
import { useCSVReader } from "react-papaparse";

import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (results: any) => void;
};

const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();
  // TODO: add a payment
  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button size={"sm"} className="w-full lg:w-auto bg-[#E7D49E] text-white" {...getRootProps()}>
          <Upload className="mr-2 size-4" />
          Importar
        </Button>
      )}
    </CSVReader>
  );
};

export default UploadButton;
