import { ToggleGroup } from "@navikt/ds-react";

const Example = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ToggleGroup defaultValue="lest" onChange={console.log}>
        <ToggleGroup.Item value="ulest">Contacts</ToggleGroup.Item>
        <ToggleGroup.Item value="lest">Components</ToggleGroup.Item>
        <ToggleGroup.Item value="sendt">Edit Org</ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
};
