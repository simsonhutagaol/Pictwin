import { LoginProvider } from "./contexts/LoginContext";
import StackHolder from "./stacks/stackHolder";
import { ApolloProvider } from "@apollo/client";
import client from "./configs/apollo";
function App() {
  return (
    <ApolloProvider client={client}>
      <LoginProvider>
        <StackHolder />
      </LoginProvider>
    </ApolloProvider>
  );
}
export default App;
