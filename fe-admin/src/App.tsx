import {
  GitHubBanner,
  Refine,
  type AuthProvider,
  Authenticated,
} from "@refinedev/core";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
  AuthPage,
  RefineThemes,
  ThemedTitleV2,
} from "@refinedev/antd";
import {
  GoogleOutlined,
  GithubOutlined,
  DashboardOutlined,
  PicCenterOutlined,
  DeploymentUnitOutlined,
  SettingOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  UngroupOutlined,
  ProfileOutlined,
  FormOutlined,
  UserOutlined,
  VideoCameraOutlined,
  BankOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  HomeOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";

import { appDataProvider } from "./utils/provider";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet, data } from "react-router";
import { App as AntdApp, ConfigProvider } from "antd";

import "@refinedev/antd/dist/reset.css";

import { PostList, PostEdit, PostShow } from "./pages/posts";
import { DashboardPage } from "./pages/dashboard";
import { CategoryEdit, CategoryList, CategoryShow } from "./pages/category";
import { ConfigEdit } from "./pages/config";
import ViVn from "antd/locale/vi_VN";
import { axiosInstance } from "@refinedev/simple-rest";
import { MenuEdit, MenuList } from "./pages/menu";
import { API_URL } from "./utils/helper";
import { CategoryPostEdit, CategoryPostList } from "./pages/categoryPost";
import { PostCreate } from "./pages/posts/create";
import { UserList } from "./pages/users";
import { OrderUserShow } from "./pages/users/show";
import { MovieList, MovieCreate, MovieEdit, MovieShow } from "./pages/movies";
import { CinemaList, CinemaCreate, CinemaEdit, CinemaShow } from "./pages/cinemas";
import { RoomList, RoomCreate, RoomEdit, RoomShow } from "./pages/rooms";
import { ShowtimeList, ShowtimeCreate, ShowtimeEdit, ShowtimeShow } from "./pages/showtimes";
import { BookingList, BookingShow } from "./pages/bookings";
import { ScanQR, ScanQRShow } from "./pages/scan";

console.log("API_URL", API_URL);
/**
 *  mock auth credentials to simulate authentication
 */
const authCredentials = {
  email: "demo@refine.dev",
  password: "demodemo",
};

const App: React.FC = () => {
  const authProvider: AuthProvider = {
    login: async ({ providerName, email, password }) => {
      if (providerName === "google") {
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
        return {
          success: true,
        };
      }

      if (providerName === "github") {
        window.location.href = "https://github.com/login/oauth/authorize";
        return {
          success: true,
        };
      }
      const request = {
        email: email,
        password: password,
      };
      try {
        const response = await axiosInstance.post(
          `${API_URL}/auth/login`,
          request
        );
        if (response.data && response.data.token && response.data.role === "ADMIN") {
          localStorage.setItem("email", email);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify({
            userId: response.data.userId,
            email: response.data.email,
            fullName: response.data.fullName,
            role: response.data.role,
          }));
          return {
            success: true,
            redirectTo: "/",
          };
        } else {
          return {
            success: false,
            error: {
              message: "Bạn không có quyền truy cập vào trang này",
              name: "Access denied",
            },
          };
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Email hoặc mật khẩu không đúng";
        return {
          success: false,
          error: {
            message: errorMessage,
            name: "Login failed",
          },
        };
      }
      

      return {
        success: false,
        error: {
          message: "Email hoặc mật khẩu không đúng",
          name: "Login failed",
        },
      };
    },
    register: async (params) => {
      const request = {
        email: params.email,
        password: params.password,
        fullName: params.fullName,
        phone: params.phone,
        dateOfBirth: params.dateOfBirth,
      };
      try {
        const response = await axiosInstance.post(
          `${API_URL}/auth/register`,
          request
        );
        if (response.data && response.data.token) {
          localStorage.setItem("email", params.email);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify({
            userId: response.data.userId,
            email: response.data.email,
            fullName: response.data.fullName,
            role: response.data.role,
          }));
          return {
            success: true,
            redirectTo: "/",
          };
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
        return {
          success: false,
          error: {
            message: errorMessage,
            name: "Register failed",
          },
        };
      }

      return {
        success: false,
        error: {
          message: "Đăng ký thất bại",
          name: "Register failed",
        },
      };
    },
    updatePassword: async (params) => {
      if (params.password === authCredentials.password) {
        //we can update password here
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: {
          message: "Update password failed",
          name: "Invalid password",
        },
      };
    },
    forgotPassword: async (params) => {
      if (params.email === authCredentials.email) {
        //we can send email with reset password link here
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: {
          message: "Forgot password failed",
          name: "Invalid email",
        },
      };
    },
    logout: async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("user");
      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return { error };
    },
    check: async () =>
      localStorage.getItem("token")
        ? {
            authenticated: true,
          }
        : {
            authenticated: false,
            error: {
              message: "Check failed",
              name: "Not authenticated",
            },
            logout: true,
            redirectTo: "/login",
          },
    getPermissions: async (params) => params?.permissions,
    getIdentity: async () => ({
      id: 1,
      name: JSON.parse(localStorage.getItem("user") || "{}").fullName,
      avatar:
        "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
    }),
  };

  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Green} locale={ViVn}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={appDataProvider(API_URL)}
            routerProvider={routerProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  icon: <DashboardOutlined />,
                },
              },
              // {
              //   name: "menus",
              //   list: "/menus",
              //   edit: "/menus/edit/:id",
              //   meta: {
              //     label: "Menu",
              //     icon: <MenuOutlined />,
              //   },
              // },
              // {
              //   name: "posts",
              //   list: "/posts",
              //   show: "/posts/show/:id",
              //   edit: "/posts/edit/:id",
              //   meta: {
              //     label: "Bài Viết",
              //     icon: <FormOutlined />,
              //   },
              // },
              // {
              //   name: "categoryposts",
              //   list: "/categoryposts",
              //   show: "/categoryposts/show/:id",
              //   edit: "/categoryposts/edit/:id",
              //   meta: {
              //     label: "Danh mục Bài Viết",
              //     icon: <ProfileOutlined />,
              //   },
              // },
              {
                name: "users",
                list: "/users",
                show: "/users/show/:id",
                meta: {
                  label: "Khách Hàng",
                  icon: <UserOutlined />,
                },
              },
              
              
             
              
              {
                name: "movies",
                list: "/movies",
                create: "/movies/create",
                edit: "/movies/edit/:id",
                show: "/movies/show/:id",
                meta: {
                  label: "Phim",
                  icon: <VideoCameraOutlined />,
                },
              },
              {
                name: "cinemas",
                list: "/cinemas",
                create: "/cinemas/create",
                edit: "/cinemas/edit/:id",
                show: "/cinemas/show/:id",
                meta: {
                  label: "Rạp Chiếu Phim",
                  icon: <BankOutlined />,
                },
              },
              {
                name: "rooms",
                list: "/rooms",
                create: "/rooms/create",
                edit: "/rooms/edit/:id",
                show: "/rooms/show/:id",
                meta: {
                  label: "Phòng Chiếu Phim",
                  icon: <HomeOutlined />,
                },
              },
              {
                name: "showtimes",
                list: "/showtimes",
                create: "/showtimes/create",
                edit: "/showtimes/edit/:id",
                show: "/showtimes/show/:id",
                meta: {
                  label: "Lịch Chiếu",
                  icon: <CalendarOutlined />,
                },
              },
              {
                name: "bookings",
                list: "/bookings",
                show: "/bookings/show/:id",
                meta: {
                  label: "Đặt Vé",
                  icon: <CreditCardOutlined />,
                },
              },
              {
                name: "scanQR",
                list: "/scanQR",
                meta: {
                  label: "Quét QR",
                  icon: <QrcodeOutlined />,
                },
              },
              {
                name: "configs",
                list: "/configs",
                meta: {
                  label: "Cài Đặt",
                  icon: <SettingOutlined />,
                },
              },
            ]}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2
                      Title={({ collapsed }) => (
                        <ThemedTitleV2
                          // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
                          collapsed={collapsed}
                          icon={
                            collapsed ? (
                              <DashboardOutlined />
                            ) : (
                              <DashboardOutlined />
                            )
                          }
                          text="Admin"
                        />
                      )}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route path="/menus">
                  <Route index element={<MenuList />} />
                  <Route path="edit/:id" element={<MenuEdit />} />
                </Route>
                <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                  <Route path="create" element={<PostCreate />} />
                </Route>
                <Route path="/categories">
                  <Route index element={<CategoryList />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                  <Route path="show/:id" element={<CategoryShow />} />
                </Route>
                <Route path="/categoryposts">
                  <Route index element={<CategoryPostList />} />
                  <Route path="edit/:id" element={<CategoryPostEdit />} />
                  <Route path="show/:id" element={<CategoryShow />} />
                </Route>
                <Route path="/users">
                  <Route index element={<UserList />} />
                
                  <Route path="show/:id" element={<OrderUserShow />} />
                </Route>
               
                
                <Route path="/configs">
                  <Route index element={<ConfigEdit />}></Route>
                </Route>

                
                <Route path="/movies">
                  <Route index element={<MovieList />} />
                  <Route path="create" element={<MovieCreate />} />
                  <Route path="edit/:id" element={<MovieEdit />} />
                  <Route path="show/:id" element={<MovieShow />} />
                </Route>
                <Route path="/cinemas">
                  <Route index element={<CinemaList />} />
                  <Route path="create" element={<CinemaCreate />} />
                  <Route path="edit/:id" element={<CinemaEdit />} />
                  <Route path="show/:id" element={<CinemaShow />} />
                </Route>
                <Route path="/rooms">
                  <Route index element={<RoomList />} />
                  <Route path="create" element={<RoomCreate />} />
                  <Route path="edit/:id" element={<RoomEdit />} />
                  <Route path="show/:id" element={<RoomShow />} />
                </Route>
                <Route path="/showtimes">
                  <Route index element={<ShowtimeList />} />
                  <Route path="create" element={<ShowtimeCreate />} />
                  <Route path="edit/:id" element={<ShowtimeEdit />} />
                  <Route path="show/:id" element={<ShowtimeShow />} />
                </Route>
                <Route path="/bookings">
                  <Route index element={<BookingList />} />
                  <Route path="show/:id" element={<BookingShow />} />
                </Route>
                <Route path="/scanQR">
                  <Route index element={<ScanQR />} />
                  <Route path="show/:id" element={<ScanQRShow />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="posts" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      // formProps={{
                      //   initialValues: {
                      //     ...authCredentials,
                      //   },
                      // }}
                      // providers={[
                      //   {
                      //     name: "google",
                      //     label: "Sign in with Google",
                      //     icon: (
                      //       <GoogleOutlined
                      //         style={{
                      //           fontSize: 24,
                      //           lineHeight: 0,
                      //         }}
                      //       />
                      //     ),
                      //   },
                      //   {
                      //     name: "github",
                      //     label: "Sign in with GitHub",
                      //     icon: (
                      //       <GithubOutlined
                      //         style={{
                      //           fontSize: 24,
                      //           lineHeight: 0,
                      //         }}
                      //       />
                      //     ),
                      //   },
                      // ]}
                      registerLink={false}
                      forgotPasswordLink={false}
                    />
                  }
                />
                {/* <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      providers={[
                        {
                          name: "google",
                          label: "Sign in with Google",
                          icon: (
                            <GoogleOutlined
                              style={{
                                fontSize: 24,
                                lineHeight: 0,
                              }}
                            />
                          ),
                        },
                        {
                          name: "github",
                          label: "Sign in with GitHub",
                          icon: (
                            <GithubOutlined
                              style={{
                                fontSize: 24,
                                lineHeight: 0,
                              }}
                            />
                          ),
                        },
                      ]}
                    />
                  }
                /> */}
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
