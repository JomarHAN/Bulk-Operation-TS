import { redirect, type ActionFunction } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import { Button, Card, Layout, Page, Popover, Text } from "@shopify/polaris";
import type { ResourceListProps } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { ResourceListExample } from "~/components/CustomResourceList";
import { productsQuery } from "~/graphql/productsQuery";
import { authenticate } from "~/shopify.server";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const response = await admin.graphql(`
  #graphQL
    mutation {
      bulkOperationRunQuery(
        query: """
          ${productsQuery}
        """
      ) {
        bulkOperation {
          id
          status
          query
          rootObjectCount
          type
          partialDataUrl
          objectCount
          fileSize
          createdAt
          url
        }
        userErrors {
          field
          message
        }
      }
    }
  `);

  if (response.ok) {
    const data = await response.json();

    console.log(data);

    // pass valuas function

    return redirect("/app/exportresult");
  }
  return null;
};

const ExportForm = (props: Props) => {
  const [activate, setActivate] = useState(false);

  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  console.log(selectedItems, "selectedItems");

  const toggleActive = useCallback(
    () => setActivate((activate) => !activate),
    [],
  );

  const actiondata = useActionData<typeof action>();
  console.log(actiondata, "actiondatahook");

  const submit = useSubmit();

  const activator = (
    <Button onClick={toggleActive} disclosure>
      Select Sheets
    </Button>
  );

  const createExport = () => {
    submit(
      {},
      {
        replace: true,
        method: "POST",
        action: "/app/exportform",
      },
    );
  };

  return (
    <Page>
      <ui-title-bar title="New Export">
        <button variant="breadcrumb">Home</button>
        <button onClick={() => {}}>Back</button>
        <button onClick={createExport} variant="primary">
          Export
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="p" fontWeight="bold">
              Format: CSV
            </Text>
          </Card>
          <br />
          <Card>
            <div style={{ position: "relative" }}>
              <Popover
                active={activate}
                activator={activator}
                onClose={toggleActive}
                fullWidth
                autofocusTarget="first-node"
              >
                <ResourceListExample
                  items={[]}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              </Popover>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ExportForm;
