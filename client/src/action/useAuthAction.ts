import { useRecoilCallback } from "recoil";
import { AuthContext, AuthState } from "../state/AuthState";
import { UserApi } from "../api";
import { toast } from "react-toastify";

export function useAuthAction() {
  const login = useRecoilCallback(
    ({ set }) =>
      async (username: string, password: string) => {
        try {
          const userApi = new UserApi(undefined, location.origin);
          const response = await userApi.usersControllerLogin({
            username,
            password,
          });
          const accessToken = response?.data?.accessToken;
          const auth = {
            token: accessToken,
          } as AuthContext;
          set(AuthState.auth, auth);
        } catch (err: any) {
          if (!err?.response) {
            toast.error("No Server Response", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else if (err.response?.status === 401) {
            toast.error("Invalid username or password", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else {
            toast.error("Login Failed", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }
      },
    []
  );

  const logout = useRecoilCallback(
    ({ set }) =>
      async () => {
        set(AuthState.auth, null);
      },
    []
  );

  return { login, logout };
}
